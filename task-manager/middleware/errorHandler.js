const errorHandler = (err, req, res, next) => {

   // INVALID OBJECT ID
   if (err.name === "CastError") {

      return res.status(400).json({

         success: false,

         message: "Invalid ObjectId"
      })
   }


   // VALIDATION ERROR
   if (err.name === "ValidationError") {

      const errors = Object.values(err.errors).map(

         item => item.message
      )

      return res.status(400).json({

         success: false,

         errors
      })
   }


   // DEFAULT ERROR
   res.status(500).json({

      success: false,

      message: err.message
   })
}

module.exports = errorHandler