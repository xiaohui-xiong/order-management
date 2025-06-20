/**
 * MD5 加密函数
 *
 * 此实现基于纯JavaScript的MD5算法
 * @param input - 要加密的字符串
 * @returns 32位小写MD5哈希值
 */
export function md5(input: string): string {
	// MD5算法的基本功能函数
	const rotateLeft = (x: number, n: number): number => {
		return (x << n) | (x >>> (32 - n))
	}

	// 字符串转字节数组 (UTF-8编码)
	const toUTF8Bytes = (str: string): Uint8Array => {
		const encoder = new TextEncoder()
		return encoder.encode(str)
	}

	// MD5算法的常量值
	const K = [
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
		0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
		0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
		0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
		0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
		0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
	]

	// 处理输入数据
	const bytes = toUTF8Bytes(input)

	// 添加必要的填充
	const paddingLength = (((bytes.length + 8) >>> 6) + 1) << 4
	const paddedBytes = new Uint8Array(paddingLength * 4)
	paddedBytes.set(bytes)

	// 添加结束位
	paddedBytes[bytes.length] = 0x80

	// 添加长度信息 (小端序)
	const lengthBits = bytes.length * 8
	const lengthBytes = new Uint8Array([
		lengthBits & 0xff,
		(lengthBits >>> 8) & 0xff,
		(lengthBits >>> 16) & 0xff,
		(lengthBits >>> 24) & 0xff,
		0,
		0,
		0,
		0,
	])

	paddedBytes.set(lengthBytes, paddingLength * 4 - 8)

	// 初始化MD5状态
	let a = 0x67452301
	let b = 0xefcdab89
	let c = 0x98badcfe
	let d = 0x10325476

	// 处理512位(64字节)数据块
	for (let i = 0; i < paddedBytes.length; i += 64) {
		const block = paddedBytes.slice(i, i + 64)
		let M = new Uint32Array(16)

		// 将64字节划分为16个32位字
		for (let j = 0; j < 16; j++) {
			const start = j * 4
			M[j] =
				block[start] |
				(block[start + 1] << 8) |
				(block[start + 2] << 16) |
				(block[start + 3] << 24)
		}

		// 保存初始值
		const AA = a
		const BB = b
		const CC = c
		const DD = d

		// 主MD5变换循环 (64步)
		for (let j = 0; j < 64; j++) {
			let F, g

			if (j < 16) {
				F = (b & c) | (~b & d)
				g = j
			} else if (j < 32) {
				F = (d & b) | (~d & c)
				g = (5 * j + 1) % 16
			} else if (j < 48) {
				F = b ^ c ^ d
				g = (3 * j + 5) % 16
			} else {
				F = c ^ (b | ~d)
				g = (7 * j) % 16
			}

			const temp = d
			d = c
			c = b

			b =
				b +
				rotateLeft(
					a + F + K[j] + M[g],
					[
						7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9,
						14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4,
						11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15,
						21, 6, 10, 15, 21, 6, 10, 15, 21,
					][j]
				)

			a = temp
		}

		// 更新状态
		a = (a + AA) >>> 0
		b = (b + BB) >>> 0
		c = (c + CC) >>> 0
		d = (d + DD) >>> 0
	}

	// 转为小端序输出
	const result = new Uint32Array([a, b, c, d])
	const output = new Uint8Array(16)

	for (let i = 0; i < 4; i++) {
		const value = result[i]
		output[i * 4] = value & 0xff
		output[i * 4 + 1] = (value >>> 8) & 0xff
		output[i * 4 + 2] = (value >>> 16) & 0xff
		output[i * 4 + 3] = (value >>> 24) & 0xff
	}

	// 转为十六进制字符串
	const hexDigits = '0123456789abcdef'
	let hexString = ''

	for (let i = 0; i < output.length; i++) {
		hexString += hexDigits.charAt(output[i] >>> 4)
		hexString += hexDigits.charAt(output[i] & 0x0f)
	}

	return hexString
}
