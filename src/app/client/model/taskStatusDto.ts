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
import { TaskLiteDto } from './taskLiteDto';


export interface TaskStatusDto { 
    /**
     * Id of the task
     */
    id: number;
    /**
     * Name of the task
     */
    name: string;
    /**
     * Tint of the task
     */
    tint: string;
    tasks?: Array<TaskLiteDto> | null;
}

