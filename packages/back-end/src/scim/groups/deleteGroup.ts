import { Response } from "express";
import { ScimError, ScimGetRequest, ScimGroup } from "../../../types/scim";
import { deleteTeam, findTeamById } from "../../models/TeamModel";
import { removeMemberFromTeam } from "../../services/organizations";

export async function deleteGroup(
  req: ScimGetRequest,
  res: Response
): Promise<Response<ScimError>> {
  console.log("deleteGroup endpoint was called");

  const { id } = req.params;

  const org = req.organization;

  const group = await findTeamById(id, org.id);

  if (!group) {
    return res.status(404).json({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
      detail: "Team ID does not exist",
      status: "404",
    });
  }

  const members = org.members.filter((member) => member.teams?.includes(id));

  try {
    await Promise.all(
      members.map((member) => {
        return removeMemberFromTeam({
          organization: org,
          userId: member.id,
          teamId: id,
        });
      })
    );

    // Delete the team
    await deleteTeam(id, org.id);
  } catch (e) {
    return res.status(400).json({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
      detail: `Unable to delete team from GrowthBook: ${e.message}`,
      status: "400",
    });
  }

  return res.status(204).json();
}
