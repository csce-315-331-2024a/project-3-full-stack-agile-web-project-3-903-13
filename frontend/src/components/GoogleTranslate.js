import Script from 'next/script';

const GoogleTranslateWidget = () => {
    return (
        <>
            <div id="google_translate_element"></div>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
            <Script id="google-translate-init" strategy="afterInteractive">
                {`
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
                }
                `}
            </Script>
        </>
    );
};

export default GoogleTranslateWidget;
