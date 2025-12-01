// client/src/pages/Policy.tsx
import React from "react";

const Policy = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to DonarFood! Your privacy is extremely important to us. This Privacy Policy explains
          how we collect, use, and protect your personal information when you use our website, mobile
          applications, or services.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
        <p>
          We may collect the following types of information:
        </p>
        <ul className="list-disc ml-6">
          <li>Personal information you provide voluntarily (name, email, phone number, etc.)</li>
          <li>Order and transaction history</li>
          <li>Device and browser information (user agent, IP address)</li>
          <li>Location information (with your consent)</li>
          <li>Cookies and usage analytics data</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p>
          The information we collect may be used for the following purposes:
        </p>
        <ul className="list-disc ml-6">
          <li>To process orders and provide services</li>
          <li>To improve and personalize your experience</li>
          <li>To communicate important updates and promotions</li>
          <li>To detect and prevent fraud or illegal activity</li>
          <li>To analyze location data for service improvements and delivery optimization</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">4. Location Information</h2>
        <p>
          We may request access to your location to provide better services such as:
        </p>
        <ul className="list-disc ml-6">
          <li>Faster delivery of your orders</li>
          <li>Showing relevant promotions based on your area</li>
          <li>Analyzing geographical usage patterns</li>
        </ul>
        <p>
          Location is collected only if you grant permission through your device or browser. You can
          disable location access at any time in your device or browser settings. We do not share
          your precise location with third parties for advertising purposes without your consent.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">5. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to:
        </p>
        <ul className="list-disc ml-6">
          <li>Remember your preferences</li>
          <li>Analyze website usage</li>
          <li>Enhance your experience on our platform</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">6. Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information only in the following
          cases:
        </p>
        <ul className="list-disc ml-6">
          <li>With trusted service providers who help us operate our business</li>
          <li>To comply with legal obligations or respond to lawful requests</li>
          <li>In the event of a merger or sale of the company</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">7. Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          information. However, no method of transmission over the Internet or electronic storage is
          100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">8. Your Rights</h2>
        <p>
          Depending on your location, you may have the right to:
        </p>
        <ul className="list-disc ml-6">
          <li>Access and request a copy of your data</li>
          <li>Correct or update inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of marketing communications</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">9. Children’s Privacy</h2>
        <p>
          Our services are not intended for children under 13 years old. We do not knowingly collect
          personal information from children. If you believe we have collected such information,
          please contact us for removal.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page,
          and the date of the last update will be indicated. We encourage you to review this page
          periodically to stay informed about how we protect your information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">11. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our data practices, please
          contact us at:
        </p>
        <ul className="list-disc ml-6">
          <li>Email: <a href="mailto:kursant410@gmail.com" className="text-blue-600 underline">kursant410@gmail.com</a></li>
          <li>Phone: <a href="tel:+998900033723" className="text-blue-600 underline">+998900033723</a></li>
          <li>Address: Jaloliddin Manguberdi Military Academic Lyceum, Urganch, Uzbekistan</li>
        </ul>
      </section>
    </div>
  );
};

export default Policy;
