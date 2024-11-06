export interface ReadingItem {
  shelf_type: string;
  visibility: number;
  item: {
    title: string;
    description: string;
    cover_image_url: string;
    rating: number;
    rating_count: number;
    display_title: string;
    category: string;
    url: string;
  };
  created_time: string;
  comment_text: string | null;
  rating_grade: number;
  tags: string[];
}