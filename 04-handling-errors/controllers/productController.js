const Product = require("./../models/product");

const AppError = require("../utilities/AppError");

const productController = {
  async getProducts(req, res) {
    try {
      const regexName = new RegExp(req.query.name, "i");
      const regexCat = new RegExp(req.query.category, "i");
      const filter = {
        name: { $regex: regexName },
        category: { $regex: regexCat },
      };

      const products = await Product.find(filter);

      res.send(products);
    } catch (error) {
      next(error);
    }
  },
  async getProductDetail(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      if (product) res.send(product);
      else {
        throw new AppError("Product Not Found", 404);
      }
    } catch (error) {
      next(error);
    }
  },
  async createProduct(req, res) {
    const p = new Product(req.body);

    p.save()
      .then((p) => {
        res.status(201);
        res.send(p);
      })
      .catch((e) => {
        return next(e);
      });
  },
  async updateProduct(req, res, next) {
    const id = req.body._id;
    const newDocument = req.body;

    const options = {
      new: true,
      runValidators: true,
    };

    try {
      const updated = await Product.findByIdAndUpdate(id, newDocument, options);

      if (updated) res.send(updated);
      else {
        throw new AppError(
          "No product was found with that ID, so nothing was updated",
          404
        );
      }
    } catch (error) {
      next(error);
    }
  },
  async deleteProduct(req, res, next) {
    try {
      const deleted = await Product.findByIdAndRemove(req.body._id);

      if (deleted) res.send(deleted);
      else {
        throw new AppError(
          "No product was found with that ID, so nothing was deleted",
          404
        );
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
