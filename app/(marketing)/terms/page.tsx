import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Medical Center Turkey",
  description:
    "Terms and conditions governing the use of Medical Center Turkey's coordination and health tourism services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: June 2025</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">1. About Medical Center Turkey</h2>
            <p>
              Medical Center Turkey (&ldquo;MCT&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is an international health tourism coordination company registered in Istanbul, Turkey. MCT is not a hospital, clinic, or healthcare provider. We act solely as an intermediary and coordinator, connecting international patients with independent, Ministry of Health certified partner hospitals and physicians.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">2. Scope of Services</h2>
            <p>
              MCT provides coordination and facilitation services including but not limited to: treatment consultation and planning, hospital and physician matching, travel and accommodation coordination, pre- and post-operative support, and patient communication management. MCT does not provide, and is not responsible for, any medical advice, diagnoses, treatment, or clinical outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">3. No Medical Advice</h2>
            <p>
              All information provided on this website and through MCT&rsquo;s communication channels is for general informational purposes only. Nothing on this platform constitutes medical advice. Final treatment suitability is determined exclusively by licensed physicians following in-person clinical evaluation. You should always consult a qualified medical professional before making any healthcare decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">4. No Guarantee of Results</h2>
            <p>
              MCT does not guarantee any medical outcomes, results, or recovery timelines. Individual results vary based on personal health conditions, physician assessment, and other factors outside MCT&rsquo;s control. Any case studies, testimonials, or before-and-after references presented are illustrative and not representative of typical outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">5. Partner Hospitals</h2>
            <p>
              All medical procedures are performed by independent licensed healthcare professionals at Ministry of Health certified partner facilities. MCT selects partner hospitals based on accreditation, quality standards, and patient safety records; however, MCT is not liable for clinical decisions, complications, or outcomes resulting from treatments performed by partner hospitals or physicians.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">6. Pricing and Packages</h2>
            <p>
              Package prices quoted by MCT are estimates based on the information provided at the time of inquiry. Final pricing may be subject to change following clinical evaluation, treatment plan adjustments, or changes in hospital or service availability. MCT will communicate any material pricing changes before confirming a booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">7. Cancellation and Refund Policy</h2>
            <p>
              Cancellation and refund terms depend on the specific package and timing of the cancellation. Patients are encouraged to review their individual package agreement. In general, cancellations made more than 14 days prior to the scheduled treatment date may be eligible for a partial refund of coordination fees. Non-refundable third-party costs (flights, accommodation, etc.) are the patient&rsquo;s responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">8. Patient Responsibilities</h2>
            <p>
              Patients are responsible for providing accurate and complete medical history and health information. Failure to disclose relevant medical conditions may affect treatment suitability and safety. Patients must follow pre- and post-operative instructions provided by their treating physicians. MCT is not liable for complications arising from inaccurate information or non-compliance with medical advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">9. Privacy and Data</h2>
            <p>
              MCT collects and processes personal and health-related data solely for the purpose of coordinating patient services. Your data is handled in accordance with our Privacy Policy. We do not sell or share your personal data with third parties beyond what is necessary to coordinate your treatment journey.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, MCT&rsquo;s liability in connection with any claim arising from coordination services shall be limited to the coordination fees paid by the patient. MCT is not liable for indirect, consequential, or incidental damages, including medical complications, travel disruptions, or loss of income.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">11. Governing Law</h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Turkey. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Istanbul, Turkey.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">12. Changes to These Terms</h2>
            <p>
              MCT reserves the right to update these Terms & Conditions at any time. Changes will be published on this page with an updated date. Continued use of MCT&rsquo;s services after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand mb-3">13. Contact</h2>
            <p>
              For questions regarding these Terms & Conditions, please contact us at:{" "}
              <a href="mailto:info@medicalcenterturkey.com" className="text-teal hover:underline">
                info@medicalcenterturkey.com
              </a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
