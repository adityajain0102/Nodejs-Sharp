// var async = require("async");
var fs = require("fs");
var mongoose = require('mongoose');
var USER = mongoose.model('user');
var jwt = require('jsonwebtoken');
var response = require('../../../../../lib/response_handler');
const constant = require('../../../../../../app/lib/constants');
const errorResponce = require('../../../../../../app/lib/errorResponce');
const UserModel = require('../models/user_model');

const config = require('../../../../../config/config').get(process.env.NODE_ENV);
const _ = require('lodash');
const sharp = require('sharp');

/* Function is used for login and return token 
 * @access private
 * @return json
 */
exports.login = async (req, resp, next) => {
	console.log("logindata", req.body);
	try {
		const { password, email } = req.body;

		if (!password || !email) {
			return new errorResponce('Invalid Credential', 401);
		}
			const user = await UserModel.findOne({
				email
			});
			if (!user) {
				return resp.status(401).json({
					success: false,
					Message: "Invalid Credential Email Not Exist"
				})
				//return new errorResponce('Invalid Credential Email Not Exist', 401);
			}
			const ismatch = await user.comparePassword(password);
			if (!ismatch) {
				return resp.status(401).json({
					success: false,
					Message: "Invalid Credentials"
				})
			}
			else if(ismatch) creattokenAndSend(user, 200, resp);

	} catch (error) {
		return next(new errorResponce(error, 400))
	}

}

/* Function is used to create the user
 * @access private
 * @return json
 */

exports.registerUser = async (req, resp, next) => {
	try {

		const user = await UserModel.create(req.body);
		//create token
		const token = user.getjwtsigntoken();

		resp.status(201).json({
			sucess: true
		});

	} catch (error) {
		return next(new errorResponce(error, 400))
	}
}

/* Function is used to update the user 
 * @access private
 * @return json
 */

exports.updateUser = async (req, resp, next) => {
	console.log("updated user by id", req.params, req.body);
	try {
		if (req.body._id) delete req.body._id;
		UserModel.findById(req.params.id).exec(function (err, user) {
			if (err) {
				return resp.status(200).json({
					sucess: false
				})
			} else if (user) {
				const UpdatedUser = _.merge(user, req.body);
				UpdatedUser.save(async function (err, updateuser) {		
					if (updateuser) {
						var ups = await UserModel.populate(updateuser, { path: "created_by" })
						console.log("after update", ups);
						resp.status(200).json({
							status: true,
							data: ups,
							Message: req.body.isDeleted ? `${constant.messages.DELETED}` : `${constant.messages.UPDATED}`
						});
					}
				})
			}
		})
	} catch (e) {
		next(new errorResponce(`${constant.messages.norecordforid} ${req.params.id}`, 404));
	}
}

/* Function is used to update the user isDeleted status to true.
 * @access private
 * @return json
 */

exports.deleteUser = async (req, resp, next) => {
	try {
		let findRolesObject = {
			_id: req.params.id,
			isDeleted: false
		}
		let updateObj = {
			isDeleted: true
		}
		const deletedUser = await UserModel.findOneAndUpdate(findRolesObject, { $set: updateObj }, {upsert: true,useFindAndModity: false});
		if (!deletedUser) {
			return resp.status(200).json({
				sucess: false
			})
		}
		resp.status(200).json({
			status: true,
			data: {},
			Message: `${constant.messages.STAFFMEMBERDELETE}`
		});
	} catch (e) {
		next(new errorResponce(`${constant.messages.norecordforid}  ${req.params.id}`, 404));
	}
}

/* Function is used to get user details based on Id
 * @access private
 * @return json
 */
exports.getRecord = async (req, resp, next) => {
	try {
		let result = {};
		if (req.params.id) {
			result = await UserModel.findById(req.params.id);
			if (!result) {
				return resp.status(200).json({
					sucess: false
				})
			} else {

				resp.status(200).json({
					sucess: true,
					data: result
				});
			}
		}

	} catch (e) {
		next(new errorResponce(`${constant.messages.notfound}`, 404));
	}
}

/* Function is used to get user profile based on payloadid
 * @access private
 * @return json
 */
exports.getProfile = async (req, resp, next) => {
	try {
		let user = req.user;
		resp.status(200).json({
			status: true,
			data: user
		});
	} catch (e) {
		console.log('creqh', req.headers)
		console.log('err', e)
		next(new errorResponce(`${constant.messages.notfound}`, 404));
	}
}
/* Function is used to create token 
 * @access public
 * @return json
 */
const creattokenAndSend = (user, statuscode, resp) => {

	if (user) {
		var userdata = {
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			isActive: user.isActive,
			phone: user.phone
		}
		
	}
	const token = user.getjwtsigntoken();
	console.log("token", token);
	const options = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
		httpOnly: true //,secure:true
	};
	resp.status(statuscode).cookie("token", token, options).json({
		code: statuscode,
		sucess: true,
		token: token,
		data: userdata
	});
}

/* Function is used to uoload profile details
 * @access private
 * @return json
 */
exports.updateUserDetails = async (req, res, next) => {
	console.log('req.body is===>', req.body)
	try {
		if (!req.body.first_name || !req.body.last_name || !req.body.email) {
			return response(res, constant.AUTH_CODE, constant.DATA_MISSING);
		} else {
			let obj = {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email
			};
			var token = req.headers.authorization.split(' ')[1]
			const payload = await jwt.verify(
				token,
				process.env.JWT_SCREATE, {
				ignoreExpiration: true
			}
			);

			USER.findOneAndUpdate({
				_id: payload.id
			}, {
				$set: obj
			}, function (err, userdata) {
				if (err) {
					return response(res, constant.ERROR_CODE, err);
				} else {
					return response(
						res,
						constant.SUCCESS_CODE,
						constant.USER_NAME_CHANGE,
						userdata
					);
				}
			});
		}
	} catch (e) {
		console.log("Error in update profile details", e)
		return res.json({
			code: constant.ERROR_CODE,
			Message: constant.SOMETHING_WENT_WRONG,
		});
	}
}

exports.imageDimensionResizer = async(req, res, next)=> {
	console.log("image resize inputs",req.body);
	try{

		res.set('Cache-Control', 'public, max-age=31557600');
		//get the original image path
		var imagePath = './app/uploads/images/' + req.body.imageName;
		console.log("imagePAth", imagePath);
		//check if it has a format, if not choose webp
		const format = req.body.format ? req.body.format : 'webp';

		//if it cant find an image show the image not found image
		if (!fs.existsSync(imagePath)) {

		imagePath = "./app/assets/cat.jpg";
		}
		//get the variables from the url
		const width = req.query.width ? parseInt(req.query.width) : 500;
		const height = req.query.height ? parseInt(req.query.height) : 400;
		const quality = req.query.quality ? req.query.quality :100;
		//create the stream — so basically read the path
		console.log("read stream ", imagePath);
		const stream = fs.createReadStream(imagePath);
		//transform the image based on our variable, then output using the quality
		const transform = sharp().resize(width, height).toFormat(format, {
		quality: parseInt(quality)
		})
		//make sure the content type is set for the correct format.
		res.set('Content-Type', `image/${format}`);
		//then output the image
		stream.pipe(transform).on('error', (e) => {
		}).pipe(res);
		return stream;
	} catch(e) {
		console.log("Error in resizing image", e)
		return res.json({
			code: constant.ERROR_CODE,
			Message: constant.SOMETHING_WENT_WRONG,
		});
	}
}
