import { ensure, isDefined, isString, JSONObject, Predicate, Serialised, TinyType } from 'tiny-types';

import { LogicError } from '../errors';
import * as artifacts from './artifacts';

export interface SerialisedArtifact extends JSONObject {
    type: string;
    base64EncodedValue: string;
}

export interface ArtifactType {
    new (base64EncodedValue: string): Artifact;
}

export abstract class Artifact extends TinyType {
    static fromJSON(o: SerialisedArtifact) {
        const
            recognisedTypes = Object.keys(artifacts),
            type            = Artifact.ofType(o.type);

        if (! type) {
            throw new LogicError(`
                Couldn't de-serialise artifact of an unknown type.
                ${o.type} is not one of the recognised types: ${recognisedTypes.join(', ')}
           `);
        }

        return new type(o.base64EncodedValue);
    }

    static ofType(name: string): ArtifactType | undefined {
        const
            types = Object.keys(artifacts),
            type = types.find(constructorName => constructorName === name);

        return artifacts[type];
    }

    constructor(public readonly base64EncodedValue: string) {
        super();
        ensure(this.constructor.name, base64EncodedValue, isDefined(), isString(), looksLikeBase64Encoded());
    }

    abstract map<T>(fn: (decodedValue: any) => T): T;

    toJSON(): SerialisedArtifact {
        return ({
            type: this.constructor.name,
            base64EncodedValue: this.base64EncodedValue,
        });
    }
}

function looksLikeBase64Encoded(): Predicate<string> {
    const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

    return Predicate.to(`be base64-encoded`, (value: string) => regex.test(value));
}
