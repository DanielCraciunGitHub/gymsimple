import { config } from "@/config";
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy for GymSimple
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Effective Date:</strong> August 4, 2025</p>
              <p><strong>Last Updated:</strong> August 4, 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                GymSimple (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, and protect your information when you use our website and mobile 
                application (collectively, the &quot;Service&quot;).
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">1. Website and Waitlist Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Email Address:</strong> When you join our waitlist through our website, we collect your email address to notify you about early access and app availability.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">2. Mobile App Information</h3>
                  <p className="text-gray-700 mb-3">Our mobile app is designed with privacy in mind and operates primarily using local storage on your device:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Workout Data:</strong> All your workout routines, exercise data, sets, reps, weights, and progress are stored locally on your device only.</li>
                    <li><strong>App Usage Data:</strong> We do not collect analytics or usage data from the mobile app.</li>
                    <li><strong>Personal Information:</strong> We do not require or collect personal information such as name, age, gender, or contact details within the mobile app.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">3. Device Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>We do not collect device identifiers, location data, or other device-specific information.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Use Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Website/Waitlist</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Email Communication:</strong> We use your email address solely to send notifications about early access, app availability, and important updates about GymSimple.</li>
                    <li><strong>No Marketing:</strong> We do not use your email for marketing purposes beyond app-related announcements.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Mobile App</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Local Storage Only:</strong> All workout data remains on your device and is never transmitted to our servers.</li>
                    <li><strong>No Profiling:</strong> We do not create user profiles or track your behavior.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Storage and Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Website/Waitlist Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Email addresses are transmitted securely and stored with appropriate security measures.</li>
                    <li>We implement reasonable security practices to protect your email information.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Mobile App Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Local Storage:</strong> All app data is stored locally on your device using secure storage methods.</li>
                    <li><strong>Your Control:</strong> You have complete control over your workout data.</li>
                    <li><strong>No Cloud Storage:</strong> We do not store your workout data on our servers or in the cloud.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Import and Export */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Import and Export</h2>
              <p className="text-gray-700 mb-3">Our mobile app includes features to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Export Data:</strong> You can export your workout data in a GymSimple-specific format for backup purposes.</li>
                <li><strong>Import Data:</strong> You can import previously exported GymSimple data to restore your workouts.</li>
                <li><strong>Data Format:</strong> Import/export uses a proprietary format specific to GymSimple and does not share data with third parties.</li>
              </ul>
            </section>

            {/* Data Sharing and Third Parties */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Third Parties</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>No Sale or Sharing:</strong> We do not sell, rent, or share your personal information with third parties.</li>
                <li><strong>No Third-Party Analytics:</strong> Our mobile app does not use third-party analytics services.</li>
                <li><strong>Service Providers:</strong> For our waitlist, we may use trusted service providers (such as Discord for notifications) who are bound by confidentiality agreements.</li>
              </ul>
            </section>

            {/* Your Rights and Choices */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <p className="text-gray-700 mb-3">You have the following rights regarding your information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request information about what personal data we have about you.</li>
                <li><strong>Deletion:</strong> Request deletion of your email from our waitlist at any time.</li>
                <li><strong>Correction:</strong> Request correction of any inaccurate information.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from email communications at any time.</li>
                <li><strong>Data Portability:</strong> For mobile app data, you can export your data at any time using the built-in export feature.</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                GymSimple is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected personal information 
                from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            {/* International Users */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Users</h2>
              <p className="text-gray-700 leading-relaxed">
                If you are located outside the United States, please be aware that information we collect may be 
                transferred to and processed in the United States. By using our Service, you consent to the transfer 
                of information to the United States.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-3">We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Posting the new Privacy Policy on our website</li>
                <li>Updating the &quot;Last Updated&quot; date at the top of this policy</li>
                <li>For significant changes, we may provide additional notice (such as email notification for waitlist subscribers)</li>
              </ul>
            </section>

            {/* Compliance */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance</h2>
              <p className="text-gray-700 mb-3">This Privacy Policy is designed to comply with applicable privacy laws, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Children&apos;s Online Privacy Protection Act (COPPA)</li>
                <li>Mobile app store privacy requirements</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Waitlist Emails:</strong> We retain email addresses until you request removal or until the service is discontinued.</li>
                <li><strong>Mobile App Data:</strong> All data is stored locally on your device and retained according to your device&apos;s storage settings and your personal data management.</li>
              </ul>
            </section>

            {/* Contact Us */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:danielcracbusiness@gmail.com">danielcracbusiness@gmail.com</a></p>
                <p className="text-gray-700"><strong>Website:</strong> <a href={config.site}>{config.site}</a></p>
              </div>
              <p className="text-gray-700 mt-4">
                For specific requests regarding your personal information, please include &quot;Privacy Request&quot; in the subject line of your email.
              </p>
            </section>

            {/* App Store Note */}
            <section className="border-t pt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Note for App Store Submission</h3>
                <p className="text-blue-800">
                  This privacy policy covers our data practices for both our website waitlist and mobile application. 
                  The mobile app operates primarily with local storage and does not transmit personal data to external servers.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
} 