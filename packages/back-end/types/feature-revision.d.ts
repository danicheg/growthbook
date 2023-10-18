import { EventAuditUser } from "../src/events/event-types";
import { FeatureRule } from "./feature";

export type FeatureRevisionSummary = Pick<
  FeatureRevisionInterface,
  | "version"
  | "baseVersion"
  | "dateCreated"
  | "datePublished"
  | "dateUpdated"
  | "comment"
  | "createdBy"
  | "status"
>;

export interface FeatureRevisionInterface {
  featureId: string;
  organization: string;
  baseVersion: number;
  version: number;
  dateCreated: Date;
  dateUpdated: Date;
  datePublished: null | Date;
  publishedBy: null | EventAuditUser;
  createdBy: EventAuditUser;
  comment: string;
  status: "draft" | "published" | "discarded";
  defaultValue: string;
  rules: Record<string, FeatureRule[]>;
}
