/**
 * 判断参数是否是Object类型
 * @param {*} o 
 */
function isObject(o) {
    return (
        !isMap(o) &&
        (typeof o === 'object' || typeof o === 'function') &&
        o !== null
    );
}

/**
 * 判断参数是否是Map类型
 * @param {*} obj 
 */
function isMap(obj) {
    if (obj instanceof Map) {
        return true;
    } else {
        return false;
    }
}

class ConfigHandler{
	constructor(data={})
	{
		this.data=data;
	}
	Process (data)
	{
		let v = data.v;
		let k = data.k;
		if(isObject(v)){
			Object.keys(v).forEach(key=>{
				if(!this.data[k])
				{
					this.data[k]={};
				}
				this.data[k][key]=v[key];
			});
		}else
		{
			this.data[k]=v;
		}
	}
}

class LuckysheetHandler
{
	constructor(cgh)
	{
		this.ConfigHandler = cgh||new ConfigHandler();
		this.Config = this.ConfigHandler.data;
	}
	
	TypeRouter(data)
	{
		let ct = data.t;
		switch(ct)
		{
			default:
				console.log(`${ct} is not defined in router.`);
			break;
			case 'cg':
				this.ConfigHandler.Process(data);
			break;
		}
	}
}


module.exports={
	LuckysheetHandler
}