import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Medical Center Turkey",
  description:
    "Privacy Policy of Medical Center Turkey. Learn how we collect, use, store, and protect your personal data in connection with our international patient coordination services.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last Updated: September 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed text-[15px]">

          <div className="space-y-4">
            <p>
              Medical Center Turkey (&ldquo;MCT&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data.
            </p>
            <p>This Privacy Policy explains how we collect, use, store, disclose, transfer, and protect personal data when you:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5">
              <li>Visit <strong className="text-gray-800">www.medicalcenterturkey.com</strong>;</li>
              <li>Submit an inquiry or request a treatment plan;</li>
              <li>Contact us by telephone, email, WhatsApp, social media, or other communication channels;</li>
              <li>Provide photographs, medical information, medical records, test results, or other documents;</li>
              <li>Request international patient coordination services; or</li>
              <li>Otherwise interact with Medical Center Turkey.</li>
            </ul>
            <p>
              Medical Center Turkey acts as an international health tourism intermediary and patient coordination company.
            </p>
            <p>
              <strong className="text-gray-800">MCT is not a hospital, clinic, physician, medical practice, or healthcare provider.</strong>
            </p>
            <p>
              Medical and clinical services are provided independently by appropriately licensed healthcare institutions and healthcare professionals.
            </p>
            <p>
              This Privacy Policy explains, at a general level, how and why we process personal data. Where applicable law requires a separate Clarification Text (<em>Aydınlatma Metni</em>) or explicit consent form (<em>Açık Rıza Metni</em>) for a specific processing activity — including the processing of health data or the promotional use of photographs or videos — that separate document will govern the specific processing activity it covers, and this Privacy Policy should be read together with it.
            </p>
          </div>

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">1. Data Controller</h2>
            <p className="mb-3">
              For personal data processed in connection with MCT&rsquo;s international patient coordination activities, the relevant data controller is:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-4">
              <p className="font-bold text-gray-800">Medical Center Turkey Sağlık Turizm Hiz. Tic. Ltd. Şti.</p>
              <p className="text-gray-600 mb-3">Istanbul, Türkiye</p>
              <p>
                <span className="text-gray-500 text-sm">Email: </span>
                <a href="mailto:hello@medicalcenterturkey.com" className="text-teal hover:underline font-medium">
                  hello@medicalcenterturkey.com
                </a>
              </p>
            </div>
            <p className="mb-3">
              Personal data is processed in accordance with applicable data protection legislation, including Turkish Personal Data Protection Law No. 6698 (&ldquo;KVKK&rdquo;).
            </p>
            <p className="mb-3">
              Where MCT is required to register with the Data Controllers&rsquo; Registry (<em>VERBİS</em>) under the criteria set by the Personal Data Protection Board, MCT&rsquo;s VERBİS registration details, where applicable, will be made available on request or, where required, published on this website.
            </p>
            <p>
              Where MCT is not required to register due to an applicable exemption, MCT processes personal data in accordance with the KVKK regardless of registration status.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">2. Personal Data We May Collect</h2>
            <p className="mb-4">
              Depending on how you interact with us and the services you request, we may collect the following categories of personal data.
            </p>

            <h3 className="text-base font-bold text-gray-800 mb-3">2.1 Identity and Contact Information</h3>
            <p className="mb-3">This may include:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-6">
              <li>Name and surname;</li>
              <li>Date of birth or age;</li>
              <li>Gender where relevant to treatment coordination;</li>
              <li>Nationality;</li>
              <li>Passport or identification information where required;</li>
              <li>Telephone number;</li>
              <li>WhatsApp number;</li>
              <li>Email address;</li>
              <li>Country of residence;</li>
              <li>Contact address; and</li>
              <li>Preferred language.</li>
            </ul>

            <h3 className="text-base font-bold text-gray-800 mb-3">2.2 Health and Medical Information</h3>
            <p className="mb-3">Where necessary to coordinate a treatment inquiry, we may collect information such as:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Medical history;</li>
              <li>Existing medical conditions;</li>
              <li>Previous operations or treatments;</li>
              <li>Current medications and supplements;</li>
              <li>Allergies;</li>
              <li>Laboratory and test results;</li>
              <li>Medical reports;</li>
              <li>X-rays, scans, or other medical images;</li>
              <li>Photographs or videos submitted for treatment assessment;</li>
              <li>Information regarding previous treatments;</li>
              <li>Information regarding smoking, alcohol, or other medically relevant lifestyle factors;</li>
              <li>Treatment preferences;</li>
              <li>Information supplied in response to medical questionnaires; and</li>
              <li>Other health-related information you voluntarily provide or that is reasonably required for your treatment inquiry.</li>
            </ul>
            <p className="mb-4">
              <strong className="text-gray-800">Health data constitutes special-category personal data under Turkish data protection law and is subject to additional safeguards and processing requirements.</strong>
            </p>
            <p className="mb-6">
              MCT does not independently diagnose medical conditions or make clinical decisions. Medical information may be transmitted to appropriate healthcare institutions or healthcare professionals for evaluation.
            </p>

            <h3 className="text-base font-bold text-gray-800 mb-3">2.3 Treatment and Coordination Information</h3>
            <p className="mb-3">We may process information relating to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-6">
              <li>Requested treatment;</li>
              <li>Preliminary treatment proposals;</li>
              <li>Healthcare institution or physician preferences;</li>
              <li>Appointment dates;</li>
              <li>Treatment schedules;</li>
              <li>Arrival and departure dates;</li>
              <li>Hotel arrangements;</li>
              <li>Airport or local transfers;</li>
              <li>Companion information;</li>
              <li>Translation requirements; and</li>
              <li>Other information necessary to coordinate the international patient journey.</li>
            </ul>

            <h3 className="text-base font-bold text-gray-800 mb-3">2.4 Communications</h3>
            <p className="mb-3">We may retain communications made through:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Email;</li>
              <li>Telephone;</li>
              <li>WhatsApp;</li>
              <li>Website forms;</li>
              <li>Social media;</li>
              <li>SMS; and</li>
              <li>Other communication platforms.</li>
            </ul>
            <p className="mb-6">
              This may include messages, documents, photographs, attachments, requests, and correspondence relating to your inquiry or coordination services.
            </p>

            <h3 className="text-base font-bold text-gray-800 mb-3">2.5 Website and Technical Data</h3>
            <p className="mb-3">When you visit our website, certain technical information may be collected automatically, including:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5">
              <li>Internet Protocol (IP) address;</li>
              <li>Browser type and version;</li>
              <li>Device type;</li>
              <li>Operating system;</li>
              <li>Website pages visited;</li>
              <li>Date and time of visits;</li>
              <li>Time spent on pages;</li>
              <li>Referring website;</li>
              <li>Approximate location derived from technical data;</li>
              <li>Cookie identifiers; and</li>
              <li>Similar technical and usage information.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">3. How We Collect Personal Data</h2>
            <p className="mb-3">We may collect personal data:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Directly from you;</li>
              <li>Through our website;</li>
              <li>Through inquiry and quotation forms;</li>
              <li>Through WhatsApp, email, telephone, SMS, or social media;</li>
              <li>From a family member, companion, or representative acting on your behalf;</li>
              <li>From healthcare institutions or healthcare professionals involved in your inquiry or treatment;</li>
              <li>From laboratories or other service providers where appropriate and legally permitted; and</li>
              <li>Automatically through cookies and similar website technologies.</li>
            </ul>
            <p>
              Where another person provides information on your behalf, they should have appropriate authority to do so.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">4. Why We Process Your Personal Data</h2>
            <p className="mb-3">We may process personal data for purposes including:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Responding to inquiries;</li>
              <li>Understanding your requested treatment;</li>
              <li>Coordinating preliminary medical assessments;</li>
              <li>Transmitting relevant medical information to healthcare institutions and healthcare professionals;</li>
              <li>Facilitating communication between you and healthcare providers;</li>
              <li>Coordinating appointments and treatment schedules;</li>
              <li>Coordinating accommodation and transportation where applicable;</li>
              <li>Providing translation or communication assistance;</li>
              <li>Managing international patient arrangements;</li>
              <li>Providing pre-treatment and post-treatment coordination;</li>
              <li>Maintaining records of communications;</li>
              <li>Responding to complaints or requests;</li>
              <li>Protecting legal rights and establishing, exercising, or defending legal claims;</li>
              <li>Complying with applicable laws and lawful requests from competent authorities;</li>
              <li>Maintaining information security;</li>
              <li>Preventing misuse, fraud, or unlawful activity;</li>
              <li>Improving our website and services; and</li>
              <li>Conducting marketing activities where legally permitted.</li>
            </ul>
            <p>
              We will process personal data only where an appropriate legal basis exists under applicable law.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">5. Processing of Health and Other Special-Category Personal Data</h2>
            <p className="mb-3">
              Health information and certain other categories of personal data receive additional protection under the KVKK.
            </p>
            <p className="mb-3">
              Such information will only be processed where a lawful condition under applicable legislation exists and appropriate technical and organisational safeguards are implemented.
            </p>
            <p className="mb-3">Depending on the circumstances, the applicable legal basis may include:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Your explicit consent where required;</li>
              <li>Processing expressly permitted or required by law;</li>
              <li>Processing necessary for the establishment, exercise, or protection of a legal right;</li>
              <li>Processing necessary in circumstances permitted under the special-category personal data provisions of the KVKK; or</li>
              <li>Another lawful processing condition provided by applicable legislation.</li>
            </ul>
            <p className="mb-3">
              Where explicit consent is relied upon, that consent will generally be requested through a separate consent form or mechanism at the relevant point of collection.
            </p>
            <p>
              You may withdraw that consent subject to applicable law. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">6. Sharing Personal Data</h2>
            <p className="mb-3">
              <strong className="text-gray-800">We do not sell your personal data or medical information.</strong>
            </p>
            <p className="mb-3">
              Where necessary for the purposes described in this Privacy Policy and where permitted by applicable law, personal data may be shared with relevant recipients, including:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Healthcare institutions;</li>
              <li>Physicians, surgeons, dentists, nurses, and other healthcare professionals;</li>
              <li>Laboratories and diagnostic providers;</li>
              <li>Pharmacies where relevant;</li>
              <li>Hotels and accommodation providers;</li>
              <li>Airport and local transportation providers;</li>
              <li>Translators and interpreters;</li>
              <li>Information technology and hosting providers;</li>
              <li>Communication service providers;</li>
              <li>Customer relationship management providers;</li>
              <li>Professional advisers, including lawyers and accountants;</li>
              <li>Insurance providers where applicable;</li>
              <li>Public authorities, courts, regulators, or law-enforcement authorities where legally required; and</li>
              <li>Other service providers reasonably necessary to provide the requested coordination service.</li>
            </ul>
            <p className="mb-3">
              Only information reasonably necessary for the relevant purpose should be shared.
            </p>
            <p>
              Healthcare institutions and healthcare professionals may process patient information independently in accordance with their own legal obligations and privacy policies.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">7. International Transfers of Personal Data</h2>
            <p className="mb-3">
              Some technologies, platforms, or service providers used in connection with our website, communications, international patient coordination activities, or business operations may process or store personal data outside Türkiye.
            </p>
            <p className="mb-3">
              Where personal data is transferred outside Türkiye, MCT will carry out such transfers in accordance with Article 9 of Turkish Personal Data Protection Law No. 6698 (&ldquo;KVKK&rdquo;) and other applicable data protection legislation.
            </p>
            <p className="mb-3">Personal data may be transferred outside Türkiye where the processing conditions under Articles 5 and, where applicable, 6 of the KVKK are satisfied and:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>An adequacy decision applicable to the relevant country, sector within a country, or international organisation is in force; or</li>
              <li>Where no applicable adequacy decision exists, one of the appropriate safeguards permitted under Article 9 of the KVKK has been provided and the data subject has the possibility to exercise their rights and access effective legal remedies in the country of transfer.</li>
            </ul>
            <p className="mb-3">Appropriate safeguards may include, where applicable:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Standard contractual clauses published by the Turkish Personal Data Protection Board and duly executed by the relevant parties;</li>
              <li>Binding corporate rules approved by the Turkish Personal Data Protection Board;</li>
              <li>A written undertaking containing appropriate data protection safeguards and approved by the Turkish Personal Data Protection Board; or</li>
              <li>An agreement, other than an international treaty, between public institutions or organisations or international organisations, together with the authorization of the Turkish Personal Data Protection Board, where applicable.</li>
            </ul>
            <p className="mb-3">
              Where neither an applicable adequacy decision nor an appropriate safeguard is available, personal data may be transferred outside Türkiye only where one of the exceptional transfer circumstances expressly permitted under Article 9 of the KVKK and applicable legislation is satisfied.
            </p>
            <p className="mb-3">
              Additional technical and organisational safeguards will be applied to health data and other special-category personal data where required by applicable legislation.
            </p>
            <p>
              Further information concerning the categories of recipients, relevant destination countries, and the transfer mechanisms applicable to a particular processing activity may be requested using the contact details provided in Section 17.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">8. Cookies and Similar Technologies</h2>
            <p className="mb-3">Our website may use cookies and similar technologies to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Enable essential website functionality;</li>
              <li>Remember user preferences;</li>
              <li>Maintain website security;</li>
              <li>Understand how visitors use the website;</li>
              <li>Measure website performance;</li>
              <li>Improve our services; and</li>
              <li>Support analytics or marketing activities where legally permitted.</li>
            </ul>
            <p className="mb-3">Some cookies are necessary for the operation of the website.</p>
            <p className="mb-3">Non-essential cookies will be used in accordance with applicable consent requirements.</p>
            <p>
              You may manage your cookie preferences through our cookie management tools and/or your browser settings.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">9. Marketing Communications</h2>
            <p className="mb-3">
              Treatment-related and coordination communications are different from marketing communications.
            </p>
            <p className="mb-3">
              Where required by applicable legislation, promotional or marketing messages will only be sent with the appropriate permission or other lawful basis.
            </p>
            <p>
              You may request to stop receiving marketing communications at any time. Stopping marketing communications does not prevent us from contacting you where necessary regarding an existing treatment inquiry, appointment, coordination arrangement, legal obligation, or other service-related matter.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">10. Data Retention</h2>
            <p className="mb-3">
              We retain personal data only for as long as reasonably necessary for the purpose for which it was collected and for any additional period required or permitted by applicable law.
            </p>
            <p className="mb-3">Retention periods may vary depending on:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>The nature of the information;</li>
              <li>The purpose for which it was collected;</li>
              <li>Legal or regulatory requirements;</li>
              <li>The establishment, exercise, or defence of legal rights;</li>
              <li>The existence of an ongoing patient inquiry or coordination process; and</li>
              <li>Applicable limitation periods.</li>
            </ul>
            <p>
              When personal data is no longer required and there is no lawful reason to retain it, it will be deleted, destroyed, or anonymised in accordance with applicable law and MCT&rsquo;s periodic destruction procedures.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">11. Data Security and Data Breach Notification</h2>
            <p className="mb-3">
              MCT takes appropriate technical and organisational measures designed to protect personal data against unauthorized access, unlawful processing, accidental loss, unauthorized disclosure, alteration, destruction, and misuse.
            </p>
            <p className="mb-3">
              Additional safeguards are applied where appropriate to health data and other special-category personal data.
            </p>
            <p className="mb-3">
              However, no internet transmission, electronic communication, or information storage system can be guaranteed to be completely secure. Patients should therefore exercise reasonable care when transmitting sensitive information electronically.
            </p>
            <p>
              If personal data processed by MCT is unlawfully obtained by third parties, MCT will notify the Personal Data Protection Board within the period required under applicable KVKK legislation and will notify affected data subjects without undue delay where required by applicable law.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">12. Your Rights Under the KVKK</h2>
            <p className="mb-3">Subject to the conditions and limitations set out under applicable law, you may have the right to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Learn whether your personal data is being processed;</li>
              <li>Request information regarding the processing of your personal data;</li>
              <li>Learn the purpose of processing and whether your personal data is being used in accordance with that purpose;</li>
              <li>Learn the third parties to whom your personal data has been transferred in Türkiye or abroad;</li>
              <li>Request correction of incomplete or inaccurate personal data;</li>
              <li>Request deletion or destruction of personal data where the applicable legal conditions are satisfied;</li>
              <li>Request notification of correction, deletion, or destruction to relevant third parties where required;</li>
              <li>Object to certain results arising from the analysis of personal data exclusively through automated systems;</li>
              <li>Request compensation where you suffer damage as a result of unlawful processing of personal data; and</li>
              <li>Exercise any other rights available under applicable data protection legislation.</li>
            </ul>
            <p className="mb-3">
              Requests may be submitted to:{" "}
              <a href="mailto:hello@medicalcenterturkey.com" className="text-teal hover:underline font-medium">
                hello@medicalcenterturkey.com
              </a>
            </p>
            <p className="mb-3">
              MCT may request appropriate information to verify your identity before responding. Requests will be answered within thirty (30) days of receipt, or such other period prescribed by applicable KVKK legislation.
            </p>
            <p>
              Where a request is rejected, answered incompletely, or not answered within the applicable period, you may lodge a complaint with the Personal Data Protection Board (<em>Kişisel Verileri Koruma Kurulu</em>) in accordance with the conditions set out in the KVKK.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">13. Photographs, Videos and Before-and-After Content</h2>
            <p className="mb-3">
              Photographs or videos submitted by a patient for treatment assessment may be processed for the purpose of evaluating and coordinating the patient&rsquo;s treatment inquiry.
            </p>
            <p className="mb-3">
              They will not automatically be used for advertising, social media, testimonials, before-and-after galleries, or other promotional purposes merely because they were submitted for medical assessment.
            </p>
            <p className="mb-3">
              Where separate authorization or explicit consent is required by applicable law for promotional use, such consent will be obtained separately through a dedicated consent form or mechanism that identifies the specific intended use.
            </p>
            <p>
              Refusal to consent to promotional use will not by itself prevent a patient from requesting treatment coordination services.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">14. Minors</h2>
            <p className="mb-3">
              MCT&rsquo;s website and international patient coordination services are primarily intended for adults.
            </p>
            <p className="mb-3">
              MCT does not knowingly collect personal data directly from a person under the age of 18 for their own independent use of MCT&rsquo;s services, and MCT&rsquo;s services are not directed at unaccompanied minors.
            </p>
            <p className="mb-3">
              Where treatment coordination concerns a person under the age of 18, personal data relating to that person may be processed where permitted under applicable law and only with the involvement, authorization, and consent of a parent, legal guardian, treating healthcare institution, or other legally authorized person, as required by applicable law.
            </p>
            <p>
              If you believe that personal data relating to a minor has been provided to MCT without the required parental, guardian, or other legally required authorization, please contact us at{" "}
              <a href="mailto:hello@medicalcenterturkey.com" className="text-teal hover:underline font-medium">
                hello@medicalcenterturkey.com
              </a>
              .
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">15. Third-Party Websites and Platforms</h2>
            <p className="mb-3">
              Our website may contain links to websites, social media platforms, healthcare institutions, or other third-party services.
            </p>
            <p>
              MCT is not responsible for the privacy practices, security, or content of independent third-party websites or platforms. Users should review the privacy policies of those third parties before providing personal information.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">16. Changes to This Privacy Policy</h2>
            <p className="mb-3">We may update this Privacy Policy from time to time to reflect:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Changes in applicable legislation;</li>
              <li>Changes in regulatory requirements;</li>
              <li>Changes to our services;</li>
              <li>Changes in technology; or</li>
              <li>Changes in our data-processing practices.</li>
            </ul>
            <p>
              The updated version will be published on our website with the applicable &ldquo;Last Updated&rdquo; date. Material changes may also be communicated through other appropriate means where required.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">17. Contact Us</h2>
            <p className="mb-4">
              For questions, requests, or concerns regarding this Privacy Policy or the processing of your personal data, please contact:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="font-bold text-gray-800">Medical Center Turkey Sağlık Turizm Hiz. Tic. Ltd. Şti.</p>
              <p className="text-gray-600">International Patient Center</p>
              <p className="text-gray-600 mb-3">Istanbul, Türkiye</p>
              <p>
                <span className="text-gray-500 text-sm">Email: </span>
                <a href="mailto:hello@medicalcenterturkey.com" className="text-teal hover:underline font-medium">
                  hello@medicalcenterturkey.com
                </a>
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              If your request is not resolved to your satisfaction, you may lodge a complaint with the Personal Data Protection Board (<em>Kişisel Verileri Koruma Kurulu</em>) in accordance with applicable law.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
