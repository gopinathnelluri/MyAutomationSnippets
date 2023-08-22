const uploadButton = document.createElement("button");
    uploadButton.textContent = "Upload JSON File";
    uploadButton.classList.add("upload-button");
    uploadButton.addEventListener("click", function () {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const fileContents = event.target.result;
                    try {
                        JSON.parse(fileContents); // Check if the file is valid JSON
                        localStorage.setItem(devicePoolsKey, fileContents);
                        location.reload(); // Reload the page to reflect the changes
                    } catch (error) {
                        alert("Invalid JSON file.");
                    }
                };
                reader.readAsText(file);
            }
        });
        fileInput.click();
    });
