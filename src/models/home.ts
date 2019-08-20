export class Home {
    homeType: string;
    description: string;
    room: string;
    amenity: string;
    rating: number;
    reviewCount: number;
    price: number;
    isNew: boolean;
    isSuperhost: boolean;
    image: string;
    detailPage: string;

    static getHomeFromJson(homeJson): Home {
        const home = new Home();
        home.homeType = homeJson.home_type;
        home.description = homeJson.description;
        home.room = homeJson.room;
        home.amenity = homeJson.amenity;
        home.rating = homeJson.rating;
        home.reviewCount = homeJson.review_count;
        home.price = homeJson.price;
        home.isNew = homeJson.is_new;
        home.isSuperhost = homeJson.isSuperhost;
        home.image = homeJson.image;
        home.detailPage = homeJson.detailPage;
        return home;
    }
}
