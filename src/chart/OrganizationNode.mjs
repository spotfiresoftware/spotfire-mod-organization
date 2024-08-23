/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class OrganizationNode {
    #nodeId;
    #parentNode;
    #object;

    #isopen
    #children;
    
    constructor(nodeId) {
        this.#nodeId = nodeId;

        this.#isopen = false;
        this.#children = [];
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS */

    // Returns the node id
    getNodeId() {
        return this.#nodeId;
    }

    // Returns the parent node id
    getParentNodeId() {
        if(this.#parentNode != null)
            return this.#parentNode.getNodeId();
        return null;
    }

    // Sets the object
    setObject(object) {
        this.#object = object;
    }

    // Gets the object
    getObject() {
        return this.#object;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DATA */

    // Adds a child node to this node as parent
    addChildNode(childNode) {
        this.#children.push(childNode);
        childNode.setParent(this);
    }

    // Set the parent node of this child node
    setParent(parentNode) {
        this.#parentNode = parentNode;
    }

    // Returns the parent node
    getParent() {
        return this.#parentNode;
    }

    // Returns list of child nodes
    getChildren() {
        return this.#children;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* PROPERTIES */

    // Returns true if the node has children
    hasChildren() {
        return this.#children.length > 0;
    }

    // Returns the open flag
    isOpen() {
        return this.#isopen;
    }

    // Sets the open flag
    setOpen(isopen) {
        this.#isopen = isopen;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS */

    // Open children
    open() {
        this.#isopen = true;
    }

    // Close children
    close() {
        this.#isopen = false;
    }

}