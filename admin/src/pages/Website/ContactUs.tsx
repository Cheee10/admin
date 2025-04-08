import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ContactUsInputGroup from "../../components/form/ContactUsForm";

export default function Cu() {
  return (
    <>

      <PageBreadcrumb pageTitle="Contact Us Page" />
      <div className="space-y-6">
        <ComponentCard title="Set Up">
          <ContactUsInputGroup />
        </ComponentCard>
      </div>
    </>
  );
}
