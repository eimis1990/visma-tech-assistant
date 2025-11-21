import PolicyHeader from '@/components/PolicyHeader'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <PolicyHeader />
      <div className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Visma Tech Assistant application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Usage Rights</h2>
            <p>
              This application is intended for use by Visma Tech employees and authorized personnel only. You agree to use the application only for lawful purposes and in accordance with company policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. AI Assistant Disclaimer</h2>
            <p>
              The Visma Tech Assistant utilizes Artificial Intelligence (AI) to provide responses and assistance. While we strive for accuracy, AI-generated content may occasionally be incorrect or misleading. You should always verify critical information (such as company policies or legal documents) with official sources.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Email Services</h2>
            <p>
              The application includes features that allow you to send emails (e.g., absence requests) through your connected Google account. By using this feature, you grant the application permission to send these specific emails on your behalf. You are responsible for the content of any emails sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Visma Tech Assistant shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>
        </div>
      </div>
    </div>
    </div>
  )
}


