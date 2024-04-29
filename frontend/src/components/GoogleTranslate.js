import Script from 'next/script';

const GoogleTranslateWidget = () => {
    return (
        <div className='left-0 bottom-0 bg-white border-gray-400 border-2 rounded-xl px-2'>
            <div id="google_translate_element"></div>
            <Script
                id="translate1" 
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="translate2" strategy="afterInteractive">
                {`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
                }
                `}
            </Script>
        </div>
    );
};

export default GoogleTranslateWidget;
