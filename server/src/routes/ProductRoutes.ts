import { Request, Response, Router } from "express";
import Product from "../models/products";
import passport from "passport";

class ProductRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    async getProducts(req: Request, res: Response) {
        if (
            req.query.hasOwnProperty("lat") &&
            req.query.hasOwnProperty("long")
        ) {
            const lat = Number(req.query.lat);
            const long = Number(req.query.long);
            if (!isNaN(lat) && !isNaN(long)) {
                const productos = await Product.find({
                    location: {
                        $near: {
                            $maxDistance: 50000,
                            $geometry: {
                                type: "Point",
                                coordinates: [lat, long],
                            },
                        },
                    },
                });
                res.json({ data: productos });
            } else {
                res.json("not a number");
            }
        } else {
            const productos = await Product.find();
            res.json(productos);
        }
    }

    async createProduct(req: Request, res: Response) {
        console.log(req.body);
        const { name, description, price, place, location } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            place,
            location,
        });
        await newProduct.save();
        res.json({ data: newProduct });
    }

    routes() {
        this.router.get(
            "/",
            passport.authenticate("jwt", { session: false }),
            this.getProducts
        );
        this.router.post(
            "/",
            passport.authenticate("jwt", { session: false }),
            this.createProduct
        );
    }
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;
