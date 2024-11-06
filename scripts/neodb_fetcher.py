import requests
import json
from datetime import datetime
from pathlib import Path
import time
import logging
import sys
from typing import Dict, List, Any, Optional
import os

class NeoDBDataFetcher:
    def __init__(self, access_token: str, debug: bool = False):
        self.base_url = "https://neodb.social/api/me/shelf/complete"
        self.headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        self.categories = [
            'movie', 'tv', 'book', 'music', 
            'podcast', 'game', 'performance'
        ]
        self.debug = debug
        self.setup_logging()
        
    def setup_logging(self):
        """配置日志系统"""
        level = logging.DEBUG if self.debug else logging.INFO
        logging.basicConfig(
            level=level,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                # logging.FileHandler('data/logs/neodb_fetch.log', encoding='utf-8'),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def fetch_category_data(self, category: str) -> List[Dict[str, Any]]:
        """获取指定类别的所有数据"""
        self.logger.info(f"开始获取 {category} 数据...")
        
        try:
            # 获取第一页和总页数
            first_page = self._fetch_page(category, 1)
            total_pages = first_page.get('pages', 1)
            
            self.logger.debug(f"{category} 总页数: {total_pages}")
            
            # 收集所有数据
            all_data = first_page.get('data', [])
            self.logger.debug(f"{category} 第1页获取到 {len(all_data)} 条数据")
            
            # 获取剩余页面
            for page in range(2, total_pages + 1):
                self.logger.info(f"获取 {category} 第 {page}/{total_pages} 页")
                page_data = self._fetch_page(category, page)
                new_items = page_data.get('data', [])
                all_data.extend(new_items)
                self.logger.debug(f"第{page}页获取到 {len(new_items)} 条数据")
                time.sleep(1)  # 添加延迟避免请求过快
                
            self.logger.info(f"{category} 数据获取完成，共 {len(all_data)} 条")
            return all_data
            
        except Exception as e:
            self.logger.error(f"获取 {category} 数据时出错: {str(e)}", exc_info=True)
            return []
    
    def _fetch_page(self, category: str, page: int) -> Dict[str, Any]:
        """获取单页数据"""
        params = {
            "category": category,
            "page": page
        }
        
        try:
            self.logger.debug(f"请求 URL: {self.base_url} 参数: {params}")
            response = requests.get(
                self.base_url,
                headers=self.headers,
                params=params,
                timeout=10  # 添加超时设置
            )
            response.raise_for_status()
            data = response.json()
            self.logger.debug(f"响应状态码: {response.status_code}")
            return data
            
        except requests.exceptions.Timeout:
            self.logger.error(f"请求超时: {category} 第 {page} 页")
            raise
        except requests.exceptions.RequestException as e:
            self.logger.error(f"请求失败: {str(e)}")
            raise
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON解析失败: {str(e)}")
            raise
    
    def save_data(self, data: Dict[str, Any], filename: str):
        """保存数据到文件"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            self.logger.debug(f"数据已保存到: {filename}")
        except Exception as e:
            self.logger.error(f"保存数据到 {filename} 失败: {str(e)}")
            raise
    
    def fetch_all_data(self) -> Dict[str, Any]:
        """获取所有类别的数据并合并"""
        all_data = []
        category_stats = {}
        
        # 创建输出目录
        output_dir = Path("public/neodb_data")
        output_dir.mkdir(exist_ok=True)
        self.logger.info(f"输出目录: {output_dir.absolute()}")
        
        start_time = time.time()
        
        # 获取每个类别的数据
        for category in self.categories:
            category_start = time.time()
            try:
                category_data = self.fetch_category_data(category)
                
                # 保存分类数据
                category_file = output_dir / f"{category}.json"
                category_result = {
                    "data": category_data,
                    "count": len(category_data),
                    "category": category,
                    "updated_at": datetime.now().isoformat()
                }
                self.save_data(category_result, category_file)
                
                all_data.extend(category_data)
                
                # 记录统计信息
                category_stats[category] = {
                    "count": len(category_data),
                    "time": round(time.time() - category_start, 2)
                }
                
            except Exception as e:
                self.logger.error(f"处理 {category} 时出错: {str(e)}")
                category_stats[category] = {
                    "count": 0,
                    "time": round(time.time() - category_start, 2),
                    "error": str(e)
                }
        
        # 排序和去重
        all_data.sort(key=lambda x: x.get('created_time', ''), reverse=True)
        
        # 保存合并后的数据
        result = {
            "data": all_data,
            "count": len(all_data),
            "categories": self.categories,
            "updated_at": datetime.now().isoformat(),
            "stats": category_stats,
            "total_time": round(time.time() - start_time, 2)
        }
        
        self.save_data(result, output_dir / 'all.json')
        
        # 输出统计信息
        self.logger.info("\n数据获取统计:")
        self.logger.info(f"总数据量: {len(all_data)} 条")
        self.logger.info(f"总耗时: {result['total_time']} 秒")
        for category, stats in category_stats.items():
            self.logger.info(f"{category}: {stats['count']} 条, 耗时 {stats['time']} 秒")
            if 'error' in stats:
                self.logger.error(f"{category} 错误: {stats['error']}")
            
        return result

def main():
    ACCESS_TOKEN = os.environ.get('NEODB_TOKEN')
    if not ACCESS_TOKEN:
        raise ValueError("Missing NEODB_TOKEN environment variable")
    
    try:
        fetcher = NeoDBDataFetcher(ACCESS_TOKEN, debug=True)
        fetcher.fetch_all_data()
        print("\n数据获取完成!")
    except Exception as e:
        print(f"错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 