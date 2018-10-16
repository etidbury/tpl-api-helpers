const DataTypes = require('sequelize/lib/data-types')

module.exports.customEntityProps = (entityProps)=>{
  
    Object.keys(entityProps).forEach((fieldName)=>{

        // transform arrays into text
        if (entityProps[fieldName] === DataTypes.ARRAY || (entityProps[fieldName].type && entityProps[fieldName].type === DataTypes.ARRAY)) {

            if (typeof entityProps[fieldName] !== 'object'){
                entityProps[fieldName] = {}
            }

            entityProps[fieldName].type = new DataTypes.TEXT()

            entityProps[fieldName].set = function(val) {
                
                if (typeof val === 'object'){
                    val = val.join(',')
                }
    
                this.setDataValue(fieldName, val)
                
            }
            entityProps[fieldName].get = function() {
                return this.getDataValue(fieldName).split(',')
            }

        }

        // note: JSON for MySQL is supported as of Sequelize 4.18 therefore below not needed unless
        // also note, Support only from MySQL versions => 5.7

        // transform json into text
        if (
            entityProps[fieldName] === DataTypes.JSON 
            || (entityProps[fieldName].type && entityProps[fieldName].type === DataTypes.JSON)
            || (entityProps[fieldName].type && entityProps[fieldName].type.key && entityProps[fieldName].type.key === 'JSON')
        ) {
            
            if (typeof entityProps[fieldName] !== 'object'){
                entityProps[fieldName] = {}
            }

            entityProps[fieldName].type = new DataTypes.TEXT()

            entityProps[fieldName].set = function(val) {
              
                if (typeof val === 'object'){
                    val = JSON.stringify(val)
                }else{
                    throw new TypeError('customEntityProps(): Invalid value specified for field name: ',fieldName,' must be JSON format')
                }
                
                this.setDataValue(fieldName, val)
            }

            entityProps[fieldName].get = function() {
                try{
                    return JSON.parse(this.getDataValue(fieldName))
                } catch(err){
                    console.error(`customEntityProps(): Failed to parse JSON field named '${fieldName}'`)
                    throw err
                }
            }
        }

    })

    return entityProps

}