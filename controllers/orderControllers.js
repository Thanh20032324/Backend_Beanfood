const { Order } = require('../models/orders');
const { History } = require('../models/history');
const { productModel } = require('../models/product.model');
const mongoose = require('mongoose');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
//

exports.createOrder = async (req, res) => {

  try {
    if (!req.body.userId || !req.body.productId || !req.body.quantity) {
      return res.status(400).json({ msg: 'Vui lòng cung cấp đủ thông tin: userId, productId, quantity' });
    }

    const product = await productModel.findById(req.body.productId).populate({ path: 'restaurantId', select: 'name' });

    if (!product || !product.restaurantId) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm hoặc thông tin nhà hàng' });
    }

    console.log(product);
    const order = new Order({
      userId: req.body.userId,
      restaurantName: product.restaurantId.name,
      name: product.name,
      image: product.image,
      price: product.realPrice,
      quantity: req.body.quantity,
    });

    const newOrder = await order.save();

    const orderId = newOrder._id;

    const history = new History({
      userId: req.body.userId,
      orderId,
      restaurantName: product.restaurantId.name,
      price: product.realPrice,
      time: new Date(),
    });

    const saveHistory = await history.save();
    res.json(saveHistory);
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ msg: 'Lỗi máy chủ nội bộ' });
  }
};
// exports.getRevenue = async (req, res) => {
//   try {
//     console.log('Thông tin nhà hàng đăng nhập:', req.restaurant);
//     const restaurantId = req.restaurant && req.restaurant.id ? req.restaurant.id : null;
//     const result = await Order.aggregate([
//         {
//             $lookup: {
//                 from: 'products',
//                 localField: 'name',
//                 foreignField: 'name',
//                 as: 'productInfo',
//             },
//         },
//         {
//             $unwind: '$productInfo',
//         },
//         {
//             $lookup: {
//                 from: 'restaurants',
//                 localField: 'productInfo.restaurantId',
//                 foreignField: '_id',
//                 as: 'restaurantInfo',
//             },
//         },
//         {
//             $unwind: '$restaurantInfo',
//         },
//         {
//             $group: {
//                 _id: '$restaurantInfo._id',
//                 restaurantName: { $first: '$restaurantInfo.name' },
//                 totalRevenue: {
//                     $sum: { $multiply: ['$price', '$quantity'] },
//                 },
//             },
//         },
//         {
//             $project: {
//                 _id: 0,
//                 restaurantId: '$_id',
//                 restaurantName: 1,
//                 totalRevenue: 1,
//             },
//         },
//         {
//           $match: {
//             'restaurantInfo': restaurantId,
//           },
//         },
//     ]);
//     console.log('gia trị data' ,result);

//     if (result.length === 0) {
//         return res.status(404).json({ msg: 'Không có đơn hàng' });
//     }

//     res.status(200).json(result);
// } catch (error) {
//     return res.status(500).json({ msg: error.message });
// }
// };
exports.getRevenue = async (req, res) => {
  try {
    console.log('Thông tin nhà hàng đăng nhập:', req.restaurant);
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ msg: 'Nhà hàng chưa đăng nhập' });
    }
    const restaurantId = user._id;

    console.log('ádasd', restaurantId);
    // Bắt đầu pipeline
    const resultAfterLookup = await Order.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'name',
          foreignField: 'name',
          as: 'productInfo',
        },
      },
      {
        $unwind: '$productInfo',
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'productInfo.restaurantId',
          foreignField: '_id',
          as: 'restaurantInfo',
        },
      },
      {
        $unwind: '$restaurantInfo',
      },
      {
        $group: {
          _id: '$restaurantInfo._id',
          restaurantName: { $first: '$restaurantInfo.name' },
          totalRevenue: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          restaurantId: '$_id',
          restaurantName: 1,
          totalRevenue: 1,
          restaurantInfo: '$restaurantInfo',
        },
      },
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
        },
      },
    
    ]);

    console.log('Dữ liệu sau $lookup:', resultAfterLookup);

    // Tiếp theo là các bước khác
    // ...

    // Cuối cùng, xem kết quả cuối cùng
    console.log('Kết quả cuối cùng:', resultAfterLookup);

    if (resultAfterLookup.length === 0) {
      return res.status(404).json({ msg: 'Không có đơn hàng' });
    }

    res.status(200).json(resultAfterLookup);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};