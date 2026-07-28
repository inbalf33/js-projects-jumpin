
let elementsArray = [];

let currentElementType = 'h1';

let currentSelectedElement = null;

const sidebarFields = {
    // מאפיינים כלליים
    width: document.getElementById('prop-width'),
    height: document.getElementById('prop-height'),
    marginV: document.getElementById('prop-margin-v'),
    marginH: document.getElementById('prop-margin-h'),    
    
    fontSize: document.getElementById('prop-font-size'),
    textColor: document.getElementById('prop-text-color'),
    bgColor: document.getElementById('prop-bg-color'),

    btnBold: document.getElementById('prop-bold'),
    btnUnderline: document.getElementById('prop-underline'),
};

const elementForm = document.getElementById("element-form");

const sideBarTitle = document.getElementById("sidebar-title");

const elementTypeSelector= document.getElementById("element-type-selector");

const textStyleContainer = document.getElementById("text-styling-container");

const dynamicInputsContainer = document.getElementById("dynamic-inputs");

const btnSubmit = document.getElementById("submit-btn");

const canvasContainer = document.getElementById("canvas-container");

const elementTypeContainer = document.getElementById("element-type-container");

const btnReset = document.getElementById("reset-btn");








// ---- Function ----

function handleElementTypeChange(e) {
    const selectedType = e ? e.target.value : "h1";
    currentElementType = selectedType;

    resetFormDefaults(selectedType);
    updateSidebarTitle(selectedType);
    toggleTextStyleSection(selectedType);
    renderDynamicInputs(selectedType);
};

function updateSidebarTitle(selectedType) {
    const sideTitle = "הוספת אלמנט - "
    switch (selectedType) {
    case "p":
        sideBarTitle.innerText = sideTitle + "פסקה";
        break;
    case "img":
        sideBarTitle.innerText = sideTitle + "תמונה";
        break;
    case "button":
        sideBarTitle.innerText = sideTitle + "כפתור";
        break;
    case "input":
        sideBarTitle.innerText = sideTitle + "שדה קלט";
        break;
    case "h1":
    default:
        sideBarTitle.innerText = sideTitle + "כותרת";
        break;
    }
};

function toggleTextStyleSection(selectedType) {
    if (selectedType === "img") {
        textStyleContainer.classList.add("d-none");        
    } else {
        textStyleContainer.classList.remove("d-none");
    }
};



function renderDynamicInputs(selectedType) {    
    let htmlContent = "";

    switch (selectedType) {
        case "p":
            htmlContent = getParagraphInputs();
            break;
        case "img":
            htmlContent = getImageInputs();
            break;
        case "button":
            htmlContent = getButtonInputs();
            break;
        case "input":
            htmlContent = getFormInputInputs();
            break;
        case "h1":
        default:
            htmlContent = getHeadingInputs();
            break;
    }
    dynamicInputsContainer.innerHTML = htmlContent;

    resetFormDefaults(selectedType);
};



function getHeadingInputs() {
    return `
        <div class="mb-3">
            <label for="prop-h1-text" class="form-label small ">
            תוכן הכותרת <span class="text-danger">*</span>:
            </label>            
            <input 
                type="text" 
                id="prop-h1-text" 
                class="form-control form-control-sm"                 
                placeholder="הכנס את טקסט הכותרת" 
                dir="auto"
                required
            >
        </div>
    `;
};

function getParagraphInputs() {
    return `
        <div class="mb-3">
            <label for="prop-p-text" class="form-label small">
            תוכן הפסקה <span class="text-danger">*</span>:
            </label>            
            <textarea 
                id="prop-p-text" 
                class="form-control form-control-sm" 
                rows="3" 
                placeholder="הכנס את טקסט הפסקה" 
                dir="auto"
                required
            ></textarea>
        </div>
    `;
}

function getImageInputs() {
    return `        
        <div class="mb-3">
            <label for="prop-img-url" class="form-label small">
                כתובת התמונה (URL) <span class="text-danger">*</span>:
            </label>
            <input 
                type="url" 
                id="prop-img-url" 
                class="form-control form-control-sm" 
                placeholder="https://example.com/image.jpg" 
                required
            >
        </div>
        
        <div class="d-flex align-items-center mb-2">
            <label for="prop-img-radius" class="form-label small mb-0" style="width: 120px;">
                <i class="bi bi-bounding-box-circles me-1"></i>רדיוס (px):
            </label>
            <input 
                type="number" 
                id="prop-img-radius" 
                class="form-control form-control-sm text-center" 
                style="width: 70px;" 
                value="0" 
                min="0"
            >
        </div>
        
        <div class="d-flex align-items-center mb-2">
            <label for="prop-img-border-width" class="form-label small mb-0" style="width: 120px;">
                עובי מסגרת (px):
            </label>
            <input 
                type="number" 
                id="prop-img-border-width" 
                class="form-control form-control-sm text-center" 
                style="width: 70px;" 
                value="0" 
                min="0"
            >
        </div>
        
        <div class="d-flex align-items-center mb-3">
            <label for="prop-img-border-color" class="form-label small mb-0" style="width: 120px;">
                צבע מסגרת:
            </label>
            <input 
                type="color" 
                id="prop-img-border-color" 
                class="form-control form-control-color form-control-sm" 
                style="width: 70px;"
                value="#000000"
            >
        </div>
    `;
}

function getButtonInputs() {
    return `        
        <div class="d-flex align-items-center mb-3">
            <label for="prop-btn-text" class="form-label small mb-0 text-nowrap" style="width: 130px; flex-shrink: 0;">
                טקסט הכפתור <span class="text-danger">*</span>:
            </label>
            <input 
                type="text" 
                id="prop-btn-text" 
                class="form-control form-control-sm flex-grow-1" 
                style="width: 0;"
                placeholder="לחץ כאן" 
                required
                dir="auto"
            >
        </div>
        
        <div class="d-flex align-items-center mb-2">
            <label for="prop-btn-radius" class="form-label small mb-0" style="width: 120px;">
                <i class="bi bi-bounding-box-circles me-1"></i>רדיוס (px):
            </label>
            <input 
                type="number" 
                id="prop-btn-radius" 
                class="form-control form-control-sm text-center" 
                style="width: 70px;" 
                value="4" 
                min="0"
            >
        </div>
        
        <div class="d-flex align-items-center mb-2">
            <label for="prop-btn-border-width" class="form-label small mb-0" style="width: 120px;">
                עובי מסגרת (px):
            </label>
            <input 
                type="number" 
                id="prop-btn-border-width" 
                class="form-control form-control-sm text-center" 
                style="width: 70px;" 
                value="1" 
                min="0"
            >
        </div>
        
        <div class="d-flex align-items-center mb-3">
            <label for="prop-btn-border-color" class="form-label small mb-0" style="width: 120px;">
                צבע מסגרת:
            </label>
            <input 
                type="color" 
                id="prop-btn-border-color" 
                class="form-control form-control-color form-control-sm" 
                style="width: 70px;"
                value="#000000"
            >
        </div>
    `;
}

function getFormInputInputs() {
    return `        
        <div class="d-flex align-items-center mb-2">
            <label for="prop-input-label" class="form-label small mb-0 text-nowrap" style="width: 130px; flex-shrink: 0;">
                תוכן התווית <span class="text-danger">*</span>:
            </label>
            <input 
                type="text" 
                id="prop-input-label" 
                class="form-control form-control-sm flex-grow-1" 
                style="width: 0;"
                placeholder="למשל: שם מלא" 
                required
                dir="auto"
            >
        </div>

        <div class="d-flex align-items-center mb-2">
            <label for="prop-input-placeholder" class="form-label small mb-0 text-nowrap" style="width: 130px; flex-shrink: 0;">
                טקסט מנחה:
            </label>
            <input 
                type="text" 
                id="prop-input-placeholder" 
                class="form-control form-control-sm flex-grow-1" 
                style="width: 0;"
                placeholder="הכנס את שם השדה" 
                dir="auto"
            >
        </div>

        <div class="d-flex align-items-center mb-3">
            <label for="prop-input-type" class="form-label small mb-0 text-nowrap" style="width: 130px; flex-shrink: 0;">
                סוג השדה:
            </label>
            <select 
                id="prop-input-type" 
                class="form-select form-select-sm flex-grow-1" 
                style="width: 0;"
            >
                <option value="text" selected>טקסט (text)</option>
                <option value="number">מספר (number)</option>
                <option value="email">אימייל (email)</option>
                <option value="password">סיסמה (password)</option>
            </select>
        </div>
    `;
}



function collectFormData() {
    const activeType = currentElementType;

    let requiredInputId = '';
    switch (activeType) {
        case 'h1': requiredInputId = 'prop-h1-text'; break;
        case 'p': requiredInputId = 'prop-p-text'; break;
        case 'img': requiredInputId = 'prop-img-url'; break;
        case 'button': requiredInputId = 'prop-btn-text'; break;
        case 'input': requiredInputId = 'prop-input-label'; break;
    }

    const requiredInput = document.getElementById(requiredInputId);

    
    if (requiredInput && !requiredInput.value.trim()) {
        requiredInput.classList.add('is-invalid'); 
        requiredInput.focus();
        return null; 
    } else if (requiredInput) {
        requiredInput.classList.remove('is-invalid');
    }

    const elementData = {
        id: Date.now(),
        type: activeType,     
        general: {
            width: sidebarFields.width?.value || '100',
            height: sidebarFields.height?.value || 'auto',
            marginVertical: sidebarFields.marginV?.value || '8',
            marginHorizontal: sidebarFields.marginH?.value || '0'
        },        
        style: {
            fontSize: sidebarFields.fontSize?.value || '16',
            textColor: sidebarFields.textColor?.value || '#000000',
            bgColor: sidebarFields.bgColor?.value || 'transparent',
            textAlign: document.querySelector('input[name="propAlign"]:checked')?.value || 'right',
            isBold: sidebarFields.btnBold?.checked || false,
            isUnderline: sidebarFields.btnUnderline?.checked || false
        },
        extra: {}
    };

    switch (activeType) {
        case "h1":
            elementData.extra.text = document.getElementById('prop-h1-text')?.value || '';
            break;
        case "p":
            elementData.extra.text = document.getElementById('prop-p-text')?.value || '';
            break;
        case "img":
            elementData.extra.src = document.getElementById('prop-img-url')?.value || '';        
            elementData.extra.radius = document.getElementById('prop-img-radius')?.value || '0';
            elementData.extra.borderWidth = document.getElementById('prop-img-border-width')?.value || '0';
            elementData.extra.borderColor = document.getElementById('prop-img-border-color')?.value || '#000000';
            break;
        case "button":
            elementData.extra.text = document.getElementById('prop-btn-text')?.value || '';
            elementData.extra.radius = document.getElementById('prop-btn-radius')?.value || '4';
            elementData.extra.borderWidth = document.getElementById('prop-btn-border-width')?.value || '0';
            elementData.extra.borderColor = document.getElementById('prop-btn-border-color')?.value || '#000000';
            break;
        case "input":
            elementData.extra.label = document.getElementById('prop-input-label')?.value || '';
            elementData.extra.placeholder = document.getElementById('prop-input-placeholder')?.value || '';
            elementData.extra.inputType = document.getElementById('prop-input-type')?.value || 'text';
            break;
    }
    return elementData;
};

function resetFormDefaults(selectedType) {
    let defaultWidth = '100'; 
    let defaultFontSize = '16'; 

    
    if (selectedType === 'input') {
        defaultWidth = '30'; 
    } else if (selectedType === 'button') {
        defaultWidth = '10';
    } else if (selectedType === 'img') {
        defaultWidth = '50';
    } else if (selectedType === 'h1') {
        defaultFontSize = '24';
    }

    if (sidebarFields.width) sidebarFields.width.value = defaultWidth;

    if (sidebarFields.height) sidebarFields.height.value = '';
    if (sidebarFields.marginV) sidebarFields.marginV.value = '8';
    if (sidebarFields.marginH) sidebarFields.marginH.value = '0';
    
    if (sidebarFields.fontSize) sidebarFields.fontSize.value = defaultFontSize;
    if (sidebarFields.textColor) sidebarFields.textColor.value = '#000000';
    if (sidebarFields.bgColor) sidebarFields.bgColor.value = '#ffffff';
    
    if (sidebarFields.btnBold) sidebarFields.btnBold.checked = false;
    if (sidebarFields.btnUnderline) sidebarFields.btnUnderline.checked = false;    
    
    const rightRadio = document.getElementById('align-right');
    if (rightRadio) rightRadio.checked = true;
}

function saveToLocalStorage() {
    localStorage.setItem('canvas_elements', JSON.stringify(elementsArray));
};

function loadFromLocalStorage() {
    const savedData = localStorage.getItem("canvas_elements");
    if (savedData) {        
        elementsArray = JSON.parse(savedData) || [];
    } else {
        elementsArray = []; 
    }
    renderCanvas(); 
}



function renderElementHTML(element) {
    const { id, type, general, style, extra } = element; 
    
    const widthVal = (general.width.endsWith('%') || general.width.endsWith('px')) 
        ? general.width 
        : general.width + '%';

    const inlineStyles = [
        `width: ${widthVal}`,
        `height: ${general.height === 'auto' || !general.height ? 'auto' : general.height + 'px'}`,
        `margin: ${general.marginVertical}px ${general.marginHorizontal}px`,
        `font-size: ${style.fontSize}px`,
        `color: ${style.textColor}`,
        `background-color: ${style.bgColor}`,
        `text-align: ${style.textAlign || 'right'}`,
        `font-weight: ${style.isBold ? 'bold' : 'normal'}`,
        `text-decoration: ${style.isUnderline ? 'underline' : 'none'}`,
        `box-sizing: border-box`,
        `overflow-wrap: break-word`,
        `padding: 4px 8px`,
        `display: block`
    ].join('; ');

    
    let contentHTML = '';
    switch (type) {
        case 'h1':
            contentHTML = `<h1 style="${inlineStyles}">${extra.text || 'כותרת חדשה'}</h1>`;
            break;

        case 'p':
            contentHTML = `<p style="${inlineStyles}">${extra.text || 'טקסט חדש...'}</p>`;
            break;

        case 'button':
            const buttonStyles = [
                inlineStyles,
                `border-radius: ${extra.radius || 0}px`,
                `border: ${extra.borderWidth || 0}px solid ${extra.borderColor || '#000000'}`,
                `cursor: pointer`
            ].join('; ');
            contentHTML = `<button class="builder-btn" style="${buttonStyles}">${extra.text || 'לחץ כאן'}</button>`;
            break;

        case 'img':            
            const imgSrc = extra.src;
            const imgStyles = [
                inlineStyles,
                `border-radius: ${extra.radius || 0}px`,
                `border: ${extra.borderWidth || 0}px solid ${extra.borderColor || '#000000'}`,
                `object-fit: contain`
            ].join('; ');
            contentHTML = `<img src="${imgSrc}" alt="תמונה" style="${imgStyles}" />`;
            break;

        case 'input':            
            const labelText = extra.label ? `<label style="display: block; margin-bottom: 4px; ${inlineStyles}">${extra.label}</label>` : '';
            contentHTML = `
                <div>
                    ${labelText}
                    <input type="text" placeholder="${extra.placeholder || 'הקלד כאן...'}" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
                </div>
            `;
            break;
    }
   
    return `
        <div class="element-wrapper position-relative d-inline-block w-100" data-id="${id}">
            
            <button 
                type="button" 
                class="delete-btn btn btn-danger btn-sm rounded-circle position-absolute top-0 start-0 m-1 d-flex align-items-center justify-content-center "
                title="מחק אלמנט"
                onclick="handleDeleteElement(event, ${id})"
            >
                <i class="bi bi-trash"></i>
            </button>            
            ${contentHTML}
        </div>
    `;
};

function handleAddElement(e) {
    if (e) e.preventDefault();

    const newElement = collectFormData();
    if (!newElement) {    
        return;
    }
    
    elementsArray.push(newElement);
    saveToLocalStorage();
    
    if (canvasContainer) {
        const emptyState = canvasContainer.querySelector('.text-center.text-muted');
        if (emptyState) {
            emptyState.remove();
        }

        canvasContainer.insertAdjacentHTML('beforeend', renderElementHTML(newElement));
    }
    
    resetFormDefaults(currentElementType);
}



function renderCanvas() {
    if (!canvasContainer) return;

    if (elementsArray.length === 0) {
        canvasContainer.innerHTML = `
            <div class="text-center text-muted p-5">
                <i class="bi bi-plus-circle fs-1 d-block mb-2"></i>
                בחר אלמנט מהסרגל הצידי ולחץ על הוספה
            </div>`;
        return;
    }

    canvasContainer.innerHTML = elementsArray.map(el => renderElementHTML(el)).join('');
}


function handleDeleteElement(event, idToDelete) {    
    if (event) event.stopPropagation();
    
    elementsArray = elementsArray.filter(item => item.id !== idToDelete);
    
    saveToLocalStorage();    
    renderCanvas();
}



function toggleElementTypeSection(shouldShow) {
    if (shouldShow) {
        elementTypeContainer.classList.remove("d-none");
    } else {
        elementTypeContainer.classList.add("d-none");
    }
}


function highlightElement(elementToHighlight) {
    
    if (currentSelectedElement) {
        currentSelectedElement.classList.remove("selected-element-highlight");
    }

    
    if (elementToHighlight) {
        currentSelectedElement = elementToHighlight;
        currentSelectedElement.classList.add("selected-element-highlight");
    } else {
        currentSelectedElement = null; 
    }
};


function handleElementSelect(e) {   
    const clickedElement = e.target.closest('.element-wrapper');
      
    if (!clickedElement) {
        highlightElement(null);
        return;
    };
   
    highlightElement(clickedElement);
};

function handleResetCanvas() {
    elementsArray = [];    
    localStorage.removeItem('canvas_elements');   
    highlightElement(null);
    renderCanvas();
};



// ---- Event Listeners ----



elementTypeSelector.addEventListener("change", handleElementTypeChange);

btnSubmit.addEventListener('click', handleAddElement);

btnReset.addEventListener('click', handleResetCanvas);

canvasContainer.addEventListener("click", handleElementSelect);

renderDynamicInputs('h1');
renderCanvas()
loadFromLocalStorage()