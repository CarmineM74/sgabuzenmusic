module App exposing (..)

import Debug
import Html exposing (Html, text, div, h1, i, img, node, p)
import Html.Attributes exposing (attribute, class, src)
import Html.Events exposing (onClick, on)
import Http
import Json.Decode exposing (list, string, int, bool, Decoder)
import Json.Decode.Pipeline exposing (decode, optional, required)
import Material
import Material.Button as Button
import Material.Card as Card
import Material.Color as Color
import Material.Elevation as Elevation
import Material.Icon as Icon
import Material.Layout as Layout
import Material.Options as Options
import Material.Table as Table
import Material.Textfield as Textfield
import Material.Toggles as Toggles
import Material.Tooltip as Tooltip
import Material.Typography as Typo


type alias Model =
    { message : String
    , logo : String
    , mdl : Material.Model
    , presets : List Preset
    , editMode : Bool
    , preset : Maybe Preset
    }


type alias Preset =
    { name : String
    , configuration : Int
    , enabled : Bool
    }


fakeData : List Preset
fakeData =
    [ Preset "Carmine" 74 True
    , Preset "Francesco" 77 True
    , Preset "Anna" 80 True
    , Preset "Enrico" 9 True
    , Preset "Assunta" 17 False
    ]


init : String -> ( Model, Cmd Msg )
init path =
    ( { message = "Guitar router is loading ..."
      , logo = path
      , mdl = Material.model
      , presets = fakeData
      , editMode = False
      , preset = Nothing
      }
    , Cmd.batch [ Layout.sub0 Mdl ]
      --, fetchPresetsCmd ]
    )


fetchPresetsCmd : Cmd Msg
fetchPresetsCmd =
    list presetDecoder
        |> Http.get "http://192.168.4.1/presets.json"
        |> Http.send PresetsLoaded


presetDecoder : Decoder Preset
presetDecoder =
    decode Preset
        |> required "name" string
        |> required "configuration" int
        |> required "enabled" bool


type Msg
    = NoOp
    | Mdl (Material.Msg Msg)
    | LoadPresets
    | PresetsLoaded (Result Http.Error (List Preset))
    | SelectPreset Preset
    | EditPreset


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Mdl msg_ ->
            Material.update Mdl msg_ model

        LoadPresets ->
            --( model, fetchPresetsCmd )
            ( { model | presets = fakeData }, Cmd.none )

        PresetsLoaded (Err _) ->
            let
                _ =
                    Debug.log "Update" "Loading presets failed"
            in
                ( model, Cmd.none )

        PresetsLoaded (Ok newPresets) ->
            ( { model | presets = newPresets }, Cmd.none )

        SelectPreset selectedPreset ->
            ( { model | preset = Just selectedPreset }, Cmd.none )

        EditPreset ->
            ( { model | editMode = True }, Cmd.none )

        _ ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    Layout.render Mdl
        model.mdl
        [ Layout.fixedHeader ]
        { header = [ header model ]
        , drawer = []
        , tabs = ( [], [] )
        , main = [ body model ]
        }


header : Model -> Html Msg
header model =
    Layout.row [ Color.background (Color.color Color.BlueGrey Color.S700) ]
        [ Layout.title [] [ text "Guitar Router" ]
        , Layout.spacer
        , img [ src "static/sgabuzen_music_logo.jpg", class "logo" ] []
        ]


body : Model -> Html Msg
body model =
    case model.editMode of
        False ->
            div []
                [ tableCard model
                ]

        True ->
            editView model


editView : Model -> Html Msg
editView model =
    let
        editHeaderText =
            case model.preset of
                Nothing ->
                    "Nuovo preset"

                Just _ ->
                    "Modifica preset"

        preset =
            case model.preset of
                Nothing ->
                    Preset "" 0 False

                Just p ->
                    p
    in
        Card.view
            [ Elevation.e2
            , Options.css "width" "98%"
            , Options.css "margin-top" "10px"
            , Options.css "margin-left" "2px"
            , Options.css "margin-right" "2px"
            ]
            [ Card.title [] [ Card.head [] [ text editHeaderText ] ]
            , Card.text []
                [ Textfield.render Mdl
                    [ 0, 0, 0 ]
                    model.mdl
                    [ Textfield.label "Nome"
                    , Textfield.floatingLabel
                    , Textfield.text_
                    , Textfield.maxlength 16
                    , Textfield.value preset.name
                    ]
                    []
                , Textfield.render Mdl
                    [ 0, 0, 1 ]
                    model.mdl
                    [ Textfield.label "Configurazione"
                    , Textfield.floatingLabel
                    , Textfield.text_
                    , Textfield.value (toString preset.configuration)
                    ]
                    []
                , Toggles.switch Mdl
                    [ 0, 0, 2 ]
                    model.mdl
                    [ Toggles.ripple
                    , Toggles.value preset.enabled
                    ]
                    []
                ]
            , Card.actions
                [ Card.border ]
                [ actionButton model.mdl [ 0, 4 ] [ Button.primary, Options.onClick LoadPresets, Tooltip.attach Mdl [ 1, 0 ] ] "clear"
                , Tooltip.render Mdl [ 1, 4 ] model.mdl [ Tooltip.top ] [ text "Annulla" ]
                , actionButton model.mdl [ 0, 5 ] [ Button.accent, Options.onClick EditPreset, Tooltip.attach Mdl [ 1, 1 ] ] "check_circle"
                , Tooltip.render Mdl [ 1, 5 ] model.mdl [ Tooltip.top ] [ text "Conferma" ]
                ]
            ]


actionButton : Material.Model -> List Int -> List (Button.Property Msg) -> String -> Html Msg
actionButton mdl btnIdx props iconName =
    Button.render Mdl
        btnIdx
        mdl
        ([ Button.ripple
         , Button.icon
         ]
            ++ props
        )
        [ Icon.i iconName ]


tableCard : Model -> Html Msg
tableCard model =
    Card.view
        [ Elevation.e2
        , Options.css "width" "98%"
        , Options.css "margin-top" "10px"
        , Options.css "margin-left" "2px"
        , Options.css "margin-right" "2px"
        ]
        [ Card.title [] [ Card.head [] [ text "Presets" ] ]
        , Card.text [] [ table model ]
        , Card.actions
            [ Card.border ]
            [ actionButton model.mdl [ 0, 0 ] [ Button.primary, Options.onClick LoadPresets, Tooltip.attach Mdl [ 1, 0 ] ] "update"
            , Tooltip.render Mdl [ 1, 0 ] model.mdl [ Tooltip.top ] [ text "Aggiorna" ]
            , actionButton model.mdl [ 0, 1 ] [ Button.accent, Options.onClick EditPreset, Tooltip.attach Mdl [ 1, 1 ] ] "add_circle"
            , Tooltip.render Mdl [ 1, 1 ] model.mdl [ Tooltip.top ] [ text "Nuovo preset" ]
            , actionButton model.mdl [ 0, 2 ] [ Button.disabled, Button.accent, Options.onClick EditPreset, Tooltip.attach Mdl [ 1, 2 ] ] "create"
            , Tooltip.render Mdl [ 1, 2 ] model.mdl [ Tooltip.top ] [ text "Modifica preset" ]
            , actionButton model.mdl [ 0, 3 ] [ Button.disabled, Tooltip.attach Mdl [ 1, 2 ] ] "remove_circle"
            , Tooltip.render Mdl [ 1, 3 ] model.mdl [ Tooltip.top ] [ text "Elimina preset" ]
            ]
        ]


presetRow : Preset -> Html Msg
presetRow preset =
    Table.tr [ Options.onClick (SelectPreset preset) ]
        [ Table.td [] [ text preset.name ]
        , Table.td [ Table.numeric ] [ text (toString preset.configuration) ]
        , Table.td [] [ text (toString preset.enabled) ]
        ]


table : Model -> Html Msg
table model =
    Table.table
        [ Elevation.e2, Options.css "width" "98%" ]
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "Nome" ]
                , Table.th [ Table.numeric ] [ text "Configurazione" ]
                , Table.th [] [ text "Abilitato" ]
                ]
            ]
        , Table.tbody []
            (List.map presetRow model.presets)
        , Table.tfoot []
            [ Table.tr []
                [ Table.td [ Options.attribute <| attribute "colspan" "3" ] [ text "pagination goes here" ]
                ]
            ]
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Layout.subs Mdl model.mdl
