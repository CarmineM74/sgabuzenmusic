module App exposing (..)

import Html exposing (Html, text, div, img, node)
import Html.Attributes exposing (attribute, class, src)
import Polymer.App as PA
import Polymer.Attributes exposing (icon, label)
import Polymer.Paper as Paper


type alias Model =
    { message : String
    , logo : String
    }


init : String -> ( Model, Cmd Msg )
init path =
    ( { message = "Guitar router is loading ...", logo = path }, Cmd.none )


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    PA.drawerLayout []
        [ drawer
        , PA.headerLayout []
            [ header model
            , div []
                [ Paper.button
                    [ attribute "raised" ""
                    , class "secondary"
                    ]
                    [ text "Aggiungi preset" ]
                ]
            ]
        ]


drawer : Html Msg
drawer =
    PA.drawer []
        [ div [ class "drawer-contents" ] [] ]


header : Model -> Html Msg
header model =
    PA.header
        [ attribute "fixed" ""
        , attribute "effects" "waterfall"
        ]
        [ PA.toolbar []
            [ Paper.iconButton
                [ icon "menu"
                  --                , attribute "drawer-toggle" ""
                ]
                []
            , div
                [ attribute "main-title" "" ]
                [ text "Guitar Router" ]
            , div []
                [ node "iron-icon" [ class "logo", src model.logo ] [] ]
            ]
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
