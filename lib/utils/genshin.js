const axios = require('axios');

const genshin = (charagi) => {
   return new Promise( async (resolve, reject) => {
       await axios.get(`https://rawcdn.githack.com/L-M0z/Api-raw-v/0bfb230d51759cd3df1db9a107c8493eb4d1cf9c/Genshinimpact/${charagi}.json`)
           .then(response => {
               if(response.status == 200){
                   const results = response.data

                   data = {}
                   data.code = response.status
                   data.message = "ok"
                   data.charagi = {
                       nama: results.name,
                       title: results.title,
		       vision: results.vision,
		       weapon: results.weapon,
		       gender: results.gender,
		       nation: results.nation,
		       rarity: results.rarity,
		       constellation: results.constellation,
		       birthday: result.birthday,
		       gambar: results.image,
		       description: results.description
                   }

                   data.creator = "LingM0"
                   console.log(results)
                   resolve(data)
               }else{
                   reject({
                       code: 500,
                       success: false,
                       message: "Server Sedang Maintance"
                   })
               }
           })
           .catch(err => {
               reject(err)
           })
   })
}

module.exports = Genshin
