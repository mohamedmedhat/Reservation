import multer from "multer";
import asyncHandler from "express-async-handler";
import Product from "../models/product.js"; // Assuming you have a product model defined

let filename = ""; // Changed const to let for filename variable

// const myStorage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, redirect) => {
//     let date = Date.now(); // Changed variable name 'daat' to 'date'
//     // Constructing the filename with current timestamp and file extension
//     let fl = date + "." + file.mimetype.split("/")[1];
//     redirect(null, fl);
//     filename = fl;
//   },
// });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

// Initialize multer upload
// const upload = multer({ storage: storage });
const upload = multer({
  dest: "/path/to/temporary/directory/to/store/uploaded/files"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


export default upload;

// [POST] http://localhost:PORT/products/uploadimg
export const uploadImage = async(req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "./uploads/image.png");

  if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!");
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }
}
// export const uploadImage = async (req, res) => {
//   try {
//     // Check if file is present in the request
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Create new product with image path
//     const newProduct = new Product({
//       name: req.body.name,
//       price: req.body.price,
//       image: req.file.path,
//     });

//     // Save product to database
//     const savedProduct = await newProduct.save();

//     res.status(201).json(savedProduct);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// [POST] http://localhost:PORT/products/create
export const CreateProduct = asyncHandler(async (req, res) => {
  try {
    const content = req.body; // Changed 'content' declaration to use 'const'
    const newProduct = new Product(content); // Changed 'NoNo' to 'newProduct'
    newProduct.image = filename;
    const createdProduct = await newProduct.save(); // Used 'await' to save the product
    filename = "";
    res.send(createdProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [GET] http://localhost:PORT/products/read
export const GetAll = asyncHandler(async (req, res) => {
  try {
    const readProduct = await Product.find(); // Used 'await' to fetch products
    res.status(200).send(readProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [GET] http://localhost:PORT/products/readbyid/:id
export const GetById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const readByIdProduct = await Product.findById(id); // Used 'await' to fetch product by id
    res.status(200).send(readByIdProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [PUT] http://localhost:PORT/products/update/:id
export const Update = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body; // Changed 'Deta' to 'data'
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true }); // Used 'await' to update product
    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// [DELETE] http://localhost:PORT/products/delete/:id
export const Delete = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(id); // Used 'await' to delete product by id
    res.status(200).send(deleteProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});
