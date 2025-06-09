const siteData = {
    personalInfo: {
        name: {
            en: { first: "Ahmed", last: "Al-Zahrani" },
            ar: { first: "أحمد", last: "الزهراني" }
        },
        phone: "0534341014",
        email: "ahmadabduallahzh@gmail.com",
        vcfLink: "assets/vcf/Ahmed_Al-Zahrani_Contact.vcf", 
        socialLinks: {
            whatsappNumber: "966534341014",
            linkedin: "https://www.linkedin.com/in/%D8%A3%D8%AD%D9%85%D8%AF-%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87-a20358193?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
        },
        copyrightYear: 2025
    },
    uiStrings: {
        en: {
            pageTitle: "Ahmed Al-Zahrani - Profile",
            aboutMeTitle: "About Me:",
            aboutMeContent: "I am Ahmed, a high school diploma graduated from TVTC. Passionate about technology, device maintenance, and operating systems. I enjoy learning programming and keeping up with new tech.",
            addVCF: "Add Contact",
            contactNow: "Contact Me",
            contactVia: "Contact via:",
            callPrefix: "Call",
            copySuffix: "Copy",
            copiedSuccess: "Copied successfully!",
            toggleCopyrightAriaLabel: "Toggle Copyright Display",
            copyrightText: "All rights reserved.",
            modeToggleTitleLight: "Switch to Light Mode",
            modeToggleTitleDark: "Switch to Dark Mode",
            modeToggleIconAltLight: "Sun icon (Light Mode)",
            modeToggleIconAltDark: "Moon icon (Dark Mode)",
            langBtnToAR: "ع",
            langToggleAriaLabel: "Current language: English, switch to Arabic",
            closeModalAriaLabel: "Close Window",
            alertClipboardUnsupported: "Clipboard API not supported.",
            alertCopyEmailFailed: "Failed to copy email."
        },
        ar: {
            pageTitle: "أحمد الزهراني - ملف شخصي",
            aboutMeTitle: "نبذة عني:",
            aboutMeContent: "أنا أحمد، خريج دبلوم من الثانوية الصناعية (TVTC). شغوف بالتقنية، صيانة الأجهزة، وأنظمة التشغيل. أستمتع بتعلم البرمجة ومواكبة جديد التكنولوجيا.",
            addVCF: "أضف جهة الاتصال",
            contactNow: "التواصل معي",
            contactVia: "تواصل عبر:",
            callPrefix: "اتصل",
            copySuffix: "انسخ",
            copiedSuccess: "تم النسخ بنجاح!",
            toggleCopyrightAriaLabel: "تبديل عرض حقوق النشر",
            copyrightText: "جميع الحقوق محفوظة.", 
            modeToggleTitleLight: "التحويل إلى الوضع المضيء",
            modeToggleTitleDark: "التحويل إلى الوضع المظلم",
            modeToggleIconAltLight: "أيقونة الشمس (الوضع المضيء)",
            modeToggleIconAltDark: "أيقونة القمر (الوضع المظلم)",
            langBtnToEN: "EN",
            langToggleAriaLabel: "اللغة الحالية: العربية، قم بالتبديل إلى الإنجليزية",
            closeModalAriaLabel: "إغلاق النافذة",
            alertClipboardUnsupported: "خاصية النسخ غير مدعومة.",
            alertCopyEmailFailed: "فشل نسخ البريد."
        }
    }
};

let currentLanguage = 'en';
let typingQueue = Promise.resolve();
const activeTypewriters = new Map();

function typeWriterEffect(elementOrSelector, text, speed = 70, clearFirst = true) {
    const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
    if (!element) {
        return Promise.resolve();
    }

    if (activeTypewriters.has(element)) {
        clearTimeout(activeTypewriters.get(element));
        activeTypewriters.delete(element);
    }

    if (clearFirst) {
        element.textContent = '';
    }
    element.classList.add('typing');

    return new Promise((resolve) => {
        let charIndex = 0;
        function typeChar() {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                const timeoutId = setTimeout(typeChar, speed);
                activeTypewriters.set(element, timeoutId);
            } else {
                element.classList.remove('typing');
                activeTypewriters.delete(element);
                resolve();
            }
        }
        setTimeout(typeChar, 10); 
    });
}

function updateTextDirectly(elementOrSelector, text) {
    const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
    if (element && text !== undefined) element.innerHTML = text;
}

function updateAttr(elementOrSelector, attribute, value) {
    const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
    if (element && value !== undefined) element.setAttribute(attribute, value);
}

async function populateAndAnimateUI(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const personalInfo = siteData.personalInfo;
    const uiStrings = siteData.uiStrings[lang];

    activeTypewriters.forEach(timeoutId => clearTimeout(timeoutId));
    activeTypewriters.clear();
    document.querySelectorAll('.typing').forEach(el => {
        el.classList.remove('typing');
    });
    typingQueue = Promise.resolve();

    document.title = uiStrings.pageTitle;

    const vcfLinkEl = document.getElementById('vcf-link');
    if (vcfLinkEl) {
        vcfLinkEl.href = personalInfo.vcfLink; 
        const vcfFileNameBase = (personalInfo.name[lang].first + "_" + personalInfo.name[lang].last).replace(/\s+/g, '_');
        vcfLinkEl.download = `${vcfFileNameBase}.vcf`; 
    }
    
    const phoneLinkModal = document.getElementById('modal-phone-link');
    if (phoneLinkModal) {
        phoneLinkModal.href = `tel:${personalInfo.phone}`;
        const phonePlaceholder = phoneLinkModal.querySelector('.phone-number-display');
        if (phonePlaceholder) phonePlaceholder.textContent = `(${personalInfo.phone})`;
    }

    const emailCopyBtnModal = document.getElementById('modal-copy-email-btn');
    if (emailCopyBtnModal) {
        emailCopyBtnModal.dataset.email = personalInfo.email;
        const emailTextSpan = emailCopyBtnModal.querySelector('.btn-text-email');
        if (emailTextSpan) {
             const emailPlaceholder = emailTextSpan.querySelector('.email-address-placeholder');
             if(emailPlaceholder) emailPlaceholder.textContent = personalInfo.email;
        }
    }
    
    const whatsappLinkModal = document.getElementById('modal-whatsapp-link');
    if (whatsappLinkModal) whatsappLinkModal.href = `https://wa.me/${personalInfo.socialLinks.whatsappNumber.replace(/\D/g, '')}`;
    
    const linkedinLinkModal = document.getElementById('modal-linkedin-link');
    if (linkedinLinkModal) linkedinLinkModal.href = personalInfo.socialLinks.linkedin;

    const langToggleButton = document.getElementById("lang-toggle-btn");
    if (langToggleButton) {
        langToggleButton.textContent = lang === 'en' ? uiStrings.langBtnToAR : uiStrings.langBtnToEN;
        updateAttr(langToggleButton, 'aria-label', lang === 'en' ? uiStrings.langToggleAriaLabel : uiStrings.langToggleAriaLabel);
    }
    const closeBtnModal = document.getElementById("close-modal-btn");
    if(closeBtnModal) updateAttr(closeBtnModal, 'aria-label', uiStrings.closeModalAriaLabel);
    
    const copyrightToggleBtn = document.getElementById('toggle-copyright-btn');
    if(copyrightToggleBtn) updateAttr(copyrightToggleBtn, 'aria-label', uiStrings.toggleCopyrightAriaLabel);

    const fullName = `${personalInfo.name[lang].first} ${personalInfo.name[lang].last}`;
    typingQueue = typingQueue.then(() => typeWriterEffect('#vcf-link span[data-translate-key="addVCF"]', uiStrings.addVCF, 15));
    typingQueue = typingQueue.then(() => typeWriterEffect('#contact-now-btn span[data-translate-key="contactNow"]', uiStrings.contactNow, 15));
    typingQueue = typingQueue.then(() => typeWriterEffect('h1[data-translate-key="profileName"]', fullName, 100));
    typingQueue = typingQueue.then(() => typeWriterEffect('strong[data-translate-key="aboutMeTitle"]', uiStrings.aboutMeTitle, 20));
    typingQueue = typingQueue.then(() => typeWriterEffect('span[data-translate-key="aboutMeContent"]', uiStrings.aboutMeContent, 15));

    
    updateTextDirectly('#modal-title', uiStrings.contactVia);
    updateTextDirectly('#modal-phone-link span[data-translate-key="callPrefix"]', uiStrings.callPrefix);
    updateTextDirectly('#modal-copy-email-btn .btn-text-email span[data-translate-key="copySuffix"]', uiStrings.copySuffix);
    
    const copyrightNoticeEl = document.getElementById('copyright-notice');
    if (copyrightNoticeEl) {
        const year = siteData.personalInfo.copyrightYear || new Date().getFullYear();
        const nameCopyright = `${personalInfo.name[lang].first} ${personalInfo.name[lang].last}`;
        const fullCopyrightText = `copy: ${year} ${nameCopyright}. ${uiStrings.copyrightText}`;
        updateTextDirectly(copyrightNoticeEl, fullCopyrightText);
    }
    
    await typingQueue;
    applyModeUI(document.body.classList.contains('dark-mode'));
}


function applyModeUI(isDark) {
    const body = document.body;
    const modeToggleButton = document.getElementById("mode-toggle-btn");
    const iconImg = document.getElementById("mode-icon");
    const uiStrings = siteData.uiStrings[currentLanguage];

    if (isDark) {
        body.classList.add("dark-mode");
        if (iconImg) {
            iconImg.src = "assets/img/sun.svg"; 
            iconImg.alt = uiStrings.modeToggleIconAltLight;
        }
        if (modeToggleButton) {
            modeToggleButton.setAttribute("aria-pressed", "true");
            modeToggleButton.title = uiStrings.modeToggleTitleLight;
            modeToggleButton.setAttribute('aria-label', uiStrings.modeToggleTitleLight);
        }
    } else {
        body.classList.remove("dark-mode");
        if (iconImg) {
            iconImg.src = "assets/img/moon.svg"; 
            iconImg.alt = uiStrings.modeToggleIconAltDark;
        }
        if (modeToggleButton) {
            modeToggleButton.setAttribute("aria-pressed", "false");
            modeToggleButton.title = uiStrings.modeToggleTitleDark;
            modeToggleButton.setAttribute('aria-label', uiStrings.modeToggleTitleDark);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    
    let preferredMode = localStorage.getItem("mode");
    if (preferredMode === null) {
        preferredMode = 'dark';
        localStorage.setItem('mode', 'dark');
    }
    applyModeUI(preferredMode === 'dark'); 
    
    populateAndAnimateUI(preferredLang);

    const langToggleButton = document.getElementById("lang-toggle-btn");
    if (langToggleButton) {
        langToggleButton.addEventListener("click", () => {
            const newLang = currentLanguage === 'en' ? 'ar' : 'en';
            populateAndAnimateUI(newLang);
        });
    }
    
    const modeToggleButton = document.getElementById("mode-toggle-btn");
    if(modeToggleButton){
        modeToggleButton.addEventListener("click", () => {
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            const newModeIsDark = !isCurrentlyDark;
            localStorage.setItem("mode", newModeIsDark ? "dark" : "light");
            applyModeUI(newModeIsDark);
        
            const iconImg = document.getElementById("mode-icon");
            if(iconImg){
                iconImg.style.transition = 'transform 0s'; 
                iconImg.style.transform = "rotate(0deg)"; 
                requestAnimationFrame(() => {
                    iconImg.style.transition = 'transform var(--transition-duration-medium) ease';
                    iconImg.style.transform = "rotate(180deg)"; 
                     setTimeout(() => {
                        iconImg.style.transform = "rotate(0deg)"; 
                    }, 200);
                });
            }
        });
    }

    const contactModal = document.getElementById("contact-modal");
    const openModalBtn = document.getElementById("contact-now-btn");
    const closeModalBtn = contactModal ? contactModal.querySelector(".close-modal-btn") : null;
    let lastFocusedElementBeforeModal;

    function openContactModal() {
        if (contactModal) {
            lastFocusedElementBeforeModal = document.activeElement;
            contactModal.style.display = "flex";
            document.body.classList.add('modal-open');

            updateTextDirectly('#modal-title', siteData.uiStrings[currentLanguage].contactVia);
            updateTextDirectly('#modal-phone-link span[data-translate-key="callPrefix"]', siteData.uiStrings[currentLanguage].callPrefix);
            
            const emailTextSpan = document.querySelector('#modal-copy-email-btn .btn-text-email');
            if(emailTextSpan) {
                const emailPlaceholder = emailTextSpan.querySelector('.email-address-placeholder');
                if(emailPlaceholder) emailPlaceholder.textContent = siteData.personalInfo.email;
                updateTextDirectly(emailTextSpan.querySelector('span[data-translate-key="copySuffix"]'), siteData.uiStrings[currentLanguage].copySuffix);
            }

            const focusableElement = contactModal.querySelector('.close-modal-btn') || contactModal.querySelector('a[href], button:not([disabled])');
            if (focusableElement) focusableElement.focus();
        }
    }

    function closeContactModal() {
        if (contactModal) {
            contactModal.style.display = "none";
            document.body.classList.remove('modal-open');
            if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
                lastFocusedElementBeforeModal.focus();
            }
        }
    }

    if (openModalBtn) openModalBtn.addEventListener("click", openContactModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeContactModal);

    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && contactModal && contactModal.style.display === "flex") {
             closeContactModal();
        }
    });
    window.addEventListener("click", function(event) {
        if (event.target === contactModal) closeContactModal();
    });

    const modalEmailButton = document.getElementById("modal-copy-email-btn");
    if (modalEmailButton) {
        modalEmailButton.addEventListener("click", () => {
            const emailToCopy = siteData.personalInfo.email;
            const emailTextSpan = modalEmailButton.querySelector('.btn-text-email');
            const originalButtonInnerHTML = `<span class="email-address-placeholder">${emailToCopy}</span> (<span data-translate-key="copySuffix">${siteData.uiStrings[currentLanguage].copySuffix}</span>)`;
            
            if (!navigator.clipboard) {
                alert(siteData.uiStrings[currentLanguage].alertClipboardUnsupported);
                return;
            }
            navigator.clipboard.writeText(emailToCopy).then(() => {
                if(emailTextSpan) emailTextSpan.textContent = siteData.uiStrings[currentLanguage].copiedSuccess;
                modalEmailButton.disabled = true;
                setTimeout(() => {
                    if(emailTextSpan) emailTextSpan.innerHTML = originalButtonInnerHTML;
                    modalEmailButton.disabled = false;
                }, 2500);
            }).catch(err => {
                console.error("Error copying email: ", err);
                alert(siteData.uiStrings[currentLanguage].alertCopyEmailFailed);
            });
        });
    }

    const toggleCopyrightBtn = document.getElementById('toggle-copyright-btn');
    const copyrightNoticeEl = document.getElementById('copyright-notice');

    if (toggleCopyrightBtn && copyrightNoticeEl) {
        updateAttr(toggleCopyrightBtn, 'aria-label', 'toggleCopyrightAriaLabel');

        toggleCopyrightBtn.addEventListener('click', () => {
            const isExpanded = toggleCopyrightBtn.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                copyrightNoticeEl.style.display = 'none';
                toggleCopyrightBtn.setAttribute('aria-expanded', 'false');
                toggleCopyrightBtn.classList.remove('expanded');
            } else {
                copyrightNoticeEl.style.display = 'block';
                
                const year = siteData.personalInfo.copyrightYear || new Date().getFullYear();
                const nameCopyright = `${siteData.personalInfo.name[currentLanguage].first} ${siteData.personalInfo.name[currentLanguage].last}`;
                const fullCopyrightText = `copy: ${year} ${nameCopyright}. ${siteData.uiStrings[currentLanguage].copyrightText}`;
                
                typeWriterEffect(copyrightNoticeEl, fullCopyrightText, 30, true);

                toggleCopyrightBtn.setAttribute('aria-expanded', 'true');
                toggleCopyrightBtn.classList.add('expanded');
            }
        });
    }
});