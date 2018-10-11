const DataTypes = require('sequelize/lib/data-types')

module.exports.customEntityProps = (entityProps)=>{
  
    Object.keys(entityProps).forEach((fieldName)=>{

        // transform arrays into text
        if (entityProps[fieldName] === DataTypes.ARRAY){
            entityProps[fieldName] = {
                type: new DataTypes.STRING,
                set(val) {
        
                    if (typeof val === 'object'){
                        val = val.join(',')
                    }
        
                    this.setDataValue(fieldName, val)
                    
                },
                get(){
                    return this.getDataValue(fieldName).split(',')
                }
            }
        }

        // note: JSON for MySQL is supported as of Sequelize 4.18 therefore below not needed unless using other engine

        // // transform object into text
        // if (entityProps[fieldName] === DataTypes.JSON){
        //     entityProps[fieldName] = {
        //         type: new DataTypes.TEXT(),
        //         set(val) {
        
        //             console.log('json...',fieldName,typeof val,val)

        //             if (typeof val === 'object'){
        //                 val = JSON.stringify(val)
        //             }else{
        //                 val = JSON.stringify(JSON.parse(val))
        //             }
                    
        //             this.setDataValue(fieldName, val)
                    
        //         },
        //         get(){
        //             try{
        //                 return JSON.parse(this.getDataValue(fieldName))
        //             } catch(err){
        //                 console.error(`customEntityProps: Failed to parse JSON field named '${fieldName}'`)
        //                 throw err
        //             }
        //         }
        //     }
        // }
    })

    return entityProps

}