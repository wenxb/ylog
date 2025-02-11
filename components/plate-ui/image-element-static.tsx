import React from 'react';

import type { SlateElementProps } from '@udecode/plate';
import type { TCaptionElement } from '@udecode/plate-caption';
import type { TImageElement } from '@udecode/plate-media';

import { cn } from '@udecode/cn';
import { NodeApi, SlateElement } from '@udecode/plate';

export function ImageElementStatic({
                                       children,
                                       className,
                                       nodeProps,
                                       ...props
                                   }: SlateElementProps) {
    const {
        align = 'center',
        caption,
        url,
        width,
    } = props.element as TImageElement &
        TCaptionElement & {
        width: number;
    };

    return (
        <SlateElement
            className={cn(className)}
            {...props}
            nodeProps={nodeProps}
        >
            <figure className="group relative" style={{ width }}>
                <div
                    className="relative max-w-full min-w-[92px]"
                    style={{ textAlign: align }}
                >
                    <img
                        className={cn(
                            'w-full max-w-full cursor-default object-cover px-0',
                            'rounded-sm'
                        )}
                        alt=""
                        src={url}
                        {...nodeProps}
                    />
                    {(caption?.length && caption[0].text !== '') && (
                        <figcaption className="mx-auto mb-[2em] -mt-[1em] h-[24px] max-w-full">
                            {NodeApi.string(caption[0])}
                        </figcaption>
                    )}
                </div>
            </figure>
            {children}
        </SlateElement>
    );
}
