const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const Booking=require('./../models/bookingModel');
const AppError = require('../utils/appError');
const User=require('../models/userModel');
const { bool } = require('sharp');

exports.getOverview = async (req, res, next) => {
  //1) Get Tour Data from collection
  const tours = await Tour.find();
  //2)Build template

  //3)Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  //1)get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  //2)Build template

  //3)render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount=(req,res)=>{
  res.status(200).render('account', {
    title: 'Your Account'
  });
}

exports.getmyTours=catchAsync(async(req,res,next)=>{
   //1.find all the booking which is beloing to tem
   const bookings=await Booking.find({ user:req.user.id});


   //2 find tours with return id
   const toursIDs=bookings.map(el=>el.tour);
   const tours=await Tour.find({ _id: { $in: toursIDs}});

   res.status(200).render('overview',{
    title:'My Tours',
    tours
   });
});

exports.updateUserData=catchAsync(async(req,res)=>{
  // console.log('Updating User',req.body)
  const updateUser=await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },
  {
    new:true,
    runValidators:true
  });
  res.status(200).render('account', {
    title: 'Your Account',
    user:updateUser
  });
});