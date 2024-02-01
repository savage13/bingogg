export default function Privacy() {
    return (
        <div className="flex h-full flex-col gap-y-8 overflow-y-scroll px-8">
            <div>
                <h1 className="pb-2 text-2xl font-bold">Privacy Policy</h1>
                <p>
                    Welcome to bingo.gg! Your privacy is important to us, and we
                    are committed to protecting the personal information that
                    you share with us. This Privacy Policy outlines how we
                    collect, use, and safeguard your information when you visit
                    our website.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">
                    Information We Collect
                </h2>
                <p className="pb-3">
                    We may collect personal information such as your username
                    and email address when you register for an account. This
                    information is used solely for account management purposes.
                    We also collect information when you connect to and interact
                    with a room, including your nickname, room actions, and chat
                    messages. This information is used solely to provide the
                    service, including preserving room history.
                </p>
                <p>
                    We also collect non-personal information, such as your IP
                    address, browser type, and device information, to improve
                    our website&#39;s functionality and user experience. This
                    information is collected through cookies and similar
                    technologies.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">
                    How We Use Your Information
                </h2>
                <p className="pb-3">
                    Your personal information is used for account management and
                    communication regarding account-related matters. We do not
                    share your information with third parties without
                    permission.
                </p>
                <p>
                    Non-personal information is used for website analytics,
                    improving our services, and enhancing the overall user
                    experience.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">Data Security</h2>
                <p>
                    We employ industry-standard security measures to protect
                    your personal information from unauthorized access,
                    disclosure, alteration, and destruction. We ensure that your
                    data is treated with the utmost confidentiality and care.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">Cookies</h2>
                <p>
                    bingo.gg uses cookies to enhance your experience on our
                    website. You may choose to disable cookies through your
                    browser settings, but please note that some features of the
                    site may not function properly without them.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">Third-Party Links</h2>
                <p>
                    Our website may contain links to third-party websites.
                    Please be aware that we are not responsible for the privacy
                    practices or content of these external sites. We encourage
                    you to review the privacy policies of these third parties.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">
                    Changes to the Privacy Policy
                </h2>
                <p>
                    We reserve the right to update or modify this Privacy Policy
                    at any time. Any changes will be effective immediately upon
                    posting on our website. We recommend reviewing this policy
                    periodically for any updates.
                </p>
            </div>
            <div>
                <h2 className="pb-1 text-lg font-bold">Contact Us</h2>
                <p>
                    If you have any questions or concerns regarding our Privacy
                    Policy, please contact us at{' '}
                    <a
                        className="line underline"
                        href="mailto:staff@bingothon.com"
                    >
                        staff@bingothon.com
                    </a>
                    . Thank you for choosing bingo.gg! Enjoy your game in a
                    secure and private environment.
                </p>
            </div>
        </div>
    );
}
