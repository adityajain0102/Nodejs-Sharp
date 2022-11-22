const express = require('express');
const {
    login,
    registerUser,
    deleteUser,
    updateUser,
    getRecord,
    getProfile,
    updateUserDetails,
    imageDimensionResizer
} = require('../controllers/user_ctrl');

const { ensureAuthorized } = require('../../../../../lib/util');
const router = express.Router();

router.route('/login').post(login); // Done
router.route('/registerUser').post(registerUser); // Done
router.route('/profiledata').get(ensureAuthorized,getProfile); // Done
router.route('/:id').put(ensureAuthorized, updateUser).delete(ensureAuthorized, deleteUser).get(ensureAuthorized, getRecord); // DONE
router.post('/updateUserDetails',ensureAuthorized, updateUserDetails); // Done
router.route('/resizeImage').post(imageDimensionResizer); // 2a image diemnsion resizer
module.exports = router;
