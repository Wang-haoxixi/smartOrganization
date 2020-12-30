import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";


const options = {
	// SDKAppID: 1400434392 , //测试用
	SDKAppID: 1400457257 ,// 正式站
};
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
const tim = TIM.create(options); // SDK 实例通常用 tim 表示
const TIMData = TIM
// 注册 COS SDK 插件
tim.registerPlugin({'cos-wx-sdk': COS});

tim.setLogLevel(1);



/* eslint-disable require-jsdoc */
// function genTestUserSig(userID) {
//   const SDKAPPID = 1400277699;
//   const EXPIRETIME = 604800;
//   const SECRETKEY = '281d8830bb13fa0923bc5c34cc13690faac214906fd5342782daba5a3e645f3c';

//   if (SDKAPPID === '' || SECRETKEY === '') {
//     alert(
//       '请先配置好您的账号信息： SDKAPPID 及 SECRETKEY ' +
//         '\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js'
//     );
//   }
//   const generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);
//   const userSig = generator.genTestUserSig(userID);
//   return {
//     sdkAppId: SDKAPPID,
//     userSig: userSig
//   };
// }

export default {
	tim,
	// TIMData,
	// genTestUserSig
}
