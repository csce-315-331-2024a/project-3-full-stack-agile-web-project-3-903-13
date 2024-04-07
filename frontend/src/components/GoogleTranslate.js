import Script from 'next/script';

const GoogleTranslateWidget = () => {
    return (
        <div style={{
            position: 'relative',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px 0',
        }}>
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
