import { service } from "../../types/service-type";
import { LuExternalLink } from "react-icons/lu";
import ExternalLink from "./links/ExternalLink";

interface UserServicesProps {
  services: service[] | [];
  name?: string;
  badgeName?: string;
}

const UserServices: React.FC<UserServicesProps> = ({
  services,
  name,
  badgeName,
}) => {
  return (
    <div className="flex flex-col md:items-center md:gap-1">
      {name && badgeName ? (
        <div>
          {name}, {badgeName}
        </div>
      ) : (
        "Available at"
      )}
      <div className="flex flex-row md:flex-col flex-wrap items-center gap-1">
        {services.map((item, index) => (
          <ExternalLink
            element={
              <div className="flex flex-row items-center gap-1">
                <LuExternalLink size={18} />
                {item.name}
              </div>
            }
            href={item.url}
            eventName="ClickUserService"
            target={item.name}
            locationOnPage="servicesComponent"
          />
        ))}
      </div>
    </div>
  );
};

export default UserServices;
