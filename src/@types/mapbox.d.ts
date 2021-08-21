export interface MapboxResponse {
  features: {
    id: string;
    type: string;
    place_type: [];
    relevance: number;
    properties: props;
    text_es: string;
    language_es: string;
    place_name: string;
    bbox: number[];
    center: [longitude: number, latitude: number];
    geometry: {};
    context: [{}];
  }[];
}
