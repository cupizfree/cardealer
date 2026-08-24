import Image from "next/image";
import Link from "next/link";

const services = [
  "Oil Change & Filter Replacement",
  "Transmission Service",
  "Brake Inspection & Repair",
  "AC & Heating Repair",
  "Tire Rotation & Balancing",
  "Wheel Alignment",
  "Battery Testing & Replacement",
  "Suspension & Steering Repair",
  "Engine Diagnostics & Repair",
  "Exhaust System Maintenance",
];

// Migrated from ../aurexo/services-center.html lines 483-570.
export default function ServicesHero() {
  return (
    <section className="bg-white pb-100">
      <div className="container">
        <h2>Sevices Center</h2>
        <div className="tf-spacing-style3" />

        <div className="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="flex justify-center flex-col wow fadeInUp">
            <h2 className="mb-12 capitalize">Aurexo Services Center</h2>
            <p className="mb-40 h7 line-height-28 text-secondary">
              Your one-stop destination for expert car services, maintenance, and repairs—keeping your
              vehicle in top condition.
            </p>

            <p className="h4 mb-20 capitalize">Our Services Include</p>
            <ul className="grid grid-cols-2 sm-grid-cols-1 gap-x-60 gap-y-8 mb-40">
              {services.map((service) => (
                <li className="flex items-start gap-8" key={service}>
                  <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
                  <div>
                    <p>{service}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex">
              <Link href="/contact-us" className="btn btn-primary btn-large-3 font-weight-600">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="ml-24 flex lg-ml-0 wow fadeInUp radius-20 image-effect-scale overflow-hidden">
            <Image className="w-full" src="/assets/images/pages/services-center.png" alt="banner-download-app" width={1002} height={752} />
          </div>
        </div>
      </div>
    </section>
  );
}
