export interface RestaurantInfo {
  id: number;
  uuid: string;
  name: string;
  address: string;
  database_connection: string;
  role_in_restaurant: string;
  is_owner: boolean;
  can_create_users: boolean;
}

export interface RestaurantSelectionResponse {
  hasMultipleRestaurants: boolean;
  restaurants: RestaurantInfo[];
  selectedRestaurant?: RestaurantInfo;
}

export interface TokenWithRestaurants {
  usersub: string;
  email: string;
  sessionuuid: string;
  origin: string;
  role: number;
  roleName: string;
  restaurants: RestaurantInfo[];
  isTemp: boolean;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}