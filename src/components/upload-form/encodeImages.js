export function encodeImages(filesArr) {
	return new Promise(async (resolve, reject) => {
		const encodedFiles = [];
		const reader = new FileReader();

		const readedFile = new Promise((resolve, reject) => {
			reader.addEventListener('load', () => {
				resolve(reader.result);
			})
			reader.addEventListener('error', () => {
				reject(reader.error)
			})
		})
		
		for (const file of filesArr) {
			reader.readAsDataURL(file);

			try {
				encodedFiles.push(await readedFile);
			} catch (error) {
				reject(error.message)
			}

			if (encodedFiles.length == filesArr.length) {
				resolve(encodedFiles);
			}
		}
	})
}