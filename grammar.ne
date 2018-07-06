@{%
const lexer = require('./lexer').lexer;
const util = require('./lexer').util;
%}

@lexer lexer

Main    -> _ Syn _                             {% util.select1 %}
         | _ Id _ ":=" _ Syn _              {% util.create("assign") %}

Id      -> %ident                              {% id %}

Syn3    -> Id                                  {% id %}
         | "(" _ Syn _ ")"                     {% util.select2 %}
         | "{" _ "}"                           {% util.create("unit") %}
         | "{" _ Syn _ ("," _ Syn _):* "}"     {% util.create("tuple") %}
Syn2    -> Syn3                                {% id %}
         | Syn2 _ "." Id                       {% util.create("proj") %}
         | Syn2 _ Syn3                         {% util.create("app") %}
Syn1    -> Syn2                                {% id %}
         | Pat _ "=>" _ Syn1                   {% util.create("fn") %}
Syn     -> Syn1                                {% id %}

Pat     -> Id                                  {% id %}
         | "(" _ Id _ ")"                      {% util.select2 %}

_       -> %space:?                            {% id %}