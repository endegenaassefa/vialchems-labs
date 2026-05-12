import { Scale } from "lucide-react";

import { siteConfig } from "@/lib/content/site";

export function AttorneyBanner() {
  return (
    <div className="alert" role="note">
      <strong>
        <Scale size={16} aria-hidden="true" /> Draft legal shell.
      </strong>{" "}
      {siteConfig.attorneyNotice}
    </div>
  );
}
