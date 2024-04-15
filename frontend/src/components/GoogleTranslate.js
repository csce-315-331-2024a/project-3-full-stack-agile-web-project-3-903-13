import Script from 'next/script';

const GoogleTranslateWidget = () => {
    return (
        <div className='fixed right-0 bottom-0 z-[1000] bg-white border-gray-400 border-2 rounded-xl md:border-0 px-2 md:relative md:flex'>
            <div id="google_translate_element"></div>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script strategy="afterInteractive">
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
