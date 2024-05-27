/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Priority } from './priority';


export interface TaskLiteDto { 
    /**
     * Id of the task
     */
    id: number;
    /**
     * Title of the task
     */
    title: string;
    /**
     * Position index of the task
     */
    index: number;
    /**
     * Priority of the task
     */
    priority: Priority;
    assigned_user_id?: number | null;
    /**
     * Completed task
     */
    is_completed: boolean;
}
export namespace TaskLiteDto {
}


