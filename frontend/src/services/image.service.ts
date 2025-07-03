export  async function  uploadImageToCloudinary(file: File): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "henrique");

        const response = await fetch("https://api.cloudinary.com/v1_1/dordxectu/image/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.log(await response.text()); // This will print the error from Cloudinary
            throw new Error(`Erro no upload: ${response.statusText}`);
        }

        const data = await response.json();
        let imageUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_500,h_500,c_fit/");
        //console.log(data.secure_url);
        return imageUrl;
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null; // Retorna null em caso de erro
    }
}