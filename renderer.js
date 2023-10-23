const { ipcRenderer } = require('electron')
const path = require('path')

const fnDrop = document.getElementById("fnDrop")
const lnDrop = document.getElementById("lnDrop")
const nnDrop = document.getElementById("nnDrop")
const filesToMerge = document.getElementById("filesToMerge")

fnDrop.addEventListener('drop', (event) => {
    event.preventDefault()
    event.stopPropagation()
    for (const f of event.dataTransfer.files) {
		const element = document.getElementById("firstNameDisplay")
        element.innerHTML = path.basename(f.path)
        const targetInput = document.getElementById("fnFile")
        targetInput.setAttribute("value", f.path);
        fnDrop.style["box-shadow"] = "none";
	}

})

fnDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

fnDrop.addEventListener('dragenter', (event) => {
    fnDrop.style["box-shadow"] = "0px 0px 10px 4px rgba(68,121,227,0.9)";
});

fnDrop.addEventListener('dragleave', (event) => {
    fnDrop.style["box-shadow"] = "none";
});


lnDrop.addEventListener('drop', (event) => {
    event.preventDefault()
    event.stopPropagation()
    for (const f of event.dataTransfer.files) {
		const element = document.getElementById("lastNameDisplay")
        element.innerHTML = path.basename(f.path)
        const targetInput = document.getElementById("lnFile")
        targetInput.setAttribute("value", f.path);
        lnDrop.style["box-shadow"] = "none";
	}

})

lnDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

lnDrop.addEventListener('dragenter', (event) => {
    lnDrop.style["box-shadow"] = "0px 0px 10px 4px rgba(68,121,227,0.9)";
});

lnDrop.addEventListener('dragleave', (event) => {
    lnDrop.style["box-shadow"] = "none";
});

nnDrop.addEventListener('drop', (event) => {
    event.preventDefault()
    event.stopPropagation()
    for (const f of event.dataTransfer.files) {
		const element = document.getElementById("nickNameDisplay")
        element.innerHTML = path.basename(f.path)
        const targetInput = document.getElementById("nnFile")
        targetInput.setAttribute("value", f.path);
        nnDrop.style["box-shadow"] = "none";
	}

})

nnDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

nnDrop.addEventListener('dragenter', (event) => {
    nnDrop.style["box-shadow"] = "0px 0px 10px 4px rgba(68,121,227,0.9)";
});

nnDrop.addEventListener('dragleave', (event) => {
	nnDrop.style["box-shadow"] = "none";
});


filesToMerge.addEventListener('drop', (event) => {
    event.preventDefault()
    event.stopPropagation()
    for (const f of event.dataTransfer.files) {
        $("#filesToMerge")
        .append($('<option>', { value : f.path })
        .text(path.basename(f.path)));
	}
    sortDropdown("#filesToMerge")
    filesToMerge.style["box-shadow"] = "none";
})

filesToMerge.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

filesToMerge.addEventListener('dragenter', (event) => {
    filesToMerge.style["box-shadow"] = "0px 0px 10px 4px rgba(68,121,227,0.9)";
});

filesToMerge.addEventListener('dragleave', (event) => {
    filesToMerge.style["box-shadow"] = "none";
});


ipcRenderer.on('open-first-names', (event, data) => {
    $("#firstName").trigger("click")
});

ipcRenderer.on('open-last-names', (event, data) => {
    $("#lastName").trigger("click")
});

ipcRenderer.on('open-nick-names', (event, data) => {
    $("#nickName").trigger("click")
});

ipcRenderer.on('convert-files', (event, data) => {
    $("#convert").trigger("click")
})

ipcRenderer.on('convert-view', (event, data) => {
    $("#backwardsDiv").css("display","none")
    $("#mergeDiv").css("display","none")
    $("#importDiv").css("display","inline-block")
})

ipcRenderer.on('merge-view', (event, data) => {
    $("#backwardsDiv").css("display","none")
    $("#mergeDiv").css("display","inline-block")
    $("#importDiv").css("display","none")
})

ipcRenderer.on('backwards-view', (event, data) => {
    $("#backwardsDiv").css("display","inline-block")
    $("#mergeDiv").css("display","none")
    $("#importDiv").css("display","none")
})
