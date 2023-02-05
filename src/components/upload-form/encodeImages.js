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
				resolve(await compressImages(encodedFiles));
			}
		}
	})
}

function compressImages(imagesArr) {
	const WIDTH = 640;
	const HEIGHT = 360;

	return new Promise(async (resolve, reject) => {
		const compressedImages = [];

		for (const imageURL of imagesArr) {
			const imageEL = document.createElement('img');
			imageEL.src = imageURL;

			try {
				const newImageURL = await new Promise((resolve, reject) => {
					imageEL.addEventListener('load', ev => {
						const canvas = document.createElement('canvas');
						canvas.width = WIDTH;
						canvas.height = HEIGHT;
		
						const context = canvas.getContext('2d');
						context.drawImage(imageEL, 0, 0, canvas.width, canvas.height);
		
						resolve(context.canvas.toDataURL('image/jpeg', 100));
					});
	
					imageEL.addEventListener('error', ev => {
						reject(ev.error);
					});
				})
	
				compressedImages.push(newImageURL);
	
				if (compressedImages.length == imagesArr.length) {
					resolve(compressedImages);
				}
			} catch (error) {
				reject(error.message);
			}
		}
	})
}