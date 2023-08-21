document.addEventListener("DOMContentLoaded", function () {
    const devicePoolsKey = "devicePools";
    let devicePools = localStorage.getItem(devicePoolsKey);

    if (!devicePools) {
        const input = prompt("Enter device pools in the format: {\"pool1\": \"VM1, VM2, VM4\", \"pool2\": \"VM3, VM5\"}");
        if (input !== null) {
            devicePools = input;
            localStorage.setItem(devicePoolsKey, input);
        }
    }

    const ribbon = document.createElement("div");
    ribbon.classList.add("ribbon");

    const closeIcon = document.createElement("span");
    closeIcon.classList.add("close-icon");
    closeIcon.textContent = "×";
    closeIcon.addEventListener("click", function () {
        ribbon.style.display = "none";
    });

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update Device Pools";
    updateButton.classList.add("update-button");
    updateButton.addEventListener("click", function () {
        const updatedInput = prompt("Edit device pools:", devicePools);
        if (updatedInput !== null) {
            devicePools = updatedInput;
            localStorage.setItem(devicePoolsKey, updatedInput);
        }
    });

    ribbon.appendChild(closeIcon);
    ribbon.appendChild(updateButton);

    const poolsObj = JSON.parse(devicePools);

    for (const pool in poolsObj) {
        const poolButton = document.createElement("button");
        poolButton.textContent = pool;
        poolButton.classList.add("pool-button");
        poolButton.addEventListener("click", function () {
            console.log("Value of key:", poolsObj[pool]);
        });
        ribbon.appendChild(poolButton);
    }

    document.body.insertBefore(ribbon, document.body.firstChild);
});


/*

.ribbon {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #007bff;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.update-button,
.pool-button {
    background-color: #fff;
    color: #007bff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.update-button:hover,
.pool-button:hover {
    background-color: #007bff;
    color: #fff;
}

.close-icon {
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    margin-right: 10px;
}

.close-icon:hover {
    color: #ff6767; /* Change color on hover */
}

*/
