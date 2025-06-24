export interface ApiResponse {
	ret: number
	iRet: number
	sMsg: string
	sAmsSerial: string
	fReqUseTime: number
	data?: any // 实际业务数据
}
