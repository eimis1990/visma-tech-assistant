export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Visma Tech Assistant ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our internal assistant application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Account Information:</strong> When you sign in, we collect your email address, name, and profile picture to authenticate you and personalize your experience.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect data about your interactions with the AI assistant, including chat history and tool usage (e.g., calculator queries, document searches).
              </li>
              <li>
                <strong>Absence Requests:</strong> If you use the absence request feature, we process the dates and types of absence you select to generate and send emails on your behalf.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and maintain the Service.</li>
              <li>Authenticate your identity via Google OAuth.</li>
              <li>Send absence request emails on your behalf via the Gmail API.</li>
              <li>Improve our AI assistant's accuracy and helpfulness.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal data. We only share data with third-party service providers (like OpenAI and ElevenLabs) as necessary to provide the AI functionality of the app. These providers are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@visma.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}


