const validateEditProfileData= (req)=>{
    const ALLOWED_UPDATES= ["skills","age","firstName","lastName","about"]

   const isEditAllowed=  Object.keys(req.body).every((field)=>ALLOWED_UPDATES.includes(field))
   return isEditAllowed
}
const validateEditProfilePassword= (req)=>{
    const ALLOWED_UPDATES= ["password"]

   const isPasswordEditAllowed=  Object.keys(req.body).every((field)=>ALLOWED_UPDATES.includes(field))
   return isPasswordEditAllowed
}
module.exports= {validateEditProfileData, validateEditProfilePassword}